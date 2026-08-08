import { Injectable, NotFoundException } from '@nestjs/common';
import { SocialsRepository } from './socials.repository';
import { UserRepository } from '../user/user.repository';
import { ResidentRepository } from '../resident/resident.repository';
import { CreatePostDto, CreateCommentDto } from './dto/socials.dto';
import { PostDocument, CommentModel } from './entities/post.entity';
import { SocialsPost, SocialsComment, UserRoles } from '@repo/schema';

function getRelativeTime(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

@Injectable()
export class SocialsService {
  constructor(
    private readonly repository: SocialsRepository,
    private readonly userRepository: UserRepository,
    private readonly residentRepository: ResidentRepository,
  ) { }

  private async formatAuthorDetails(userId: string, societyId: string) {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      return {
        authorName: 'Unknown Resident',
        authorRole: UserRoles.RESIDENTS,
        authorRoleLabel: 'Resident',
        authorAvatar: undefined,
      };
    }

    const authorName = `${user.firstName} ${user.lastName}`;
    const authorAvatar = user.profilePhoto;

    if (user.role === UserRoles.ADMIN || user.role === UserRoles.SUPER_ADMIN) {
      return {
        authorName,
        authorRole: user.role,
        authorRoleLabel: 'Admin · Management Office',
        authorAvatar,
      };
    }

    if (user.role === UserRoles.GUARD) {
      return {
        authorName,
        authorRole: user.role,
        authorRoleLabel: 'Security Supervisor',
        authorAvatar,
      };
    }

    // Default to Resident flat lookup
    const resident = await this.residentRepository.findByUserId(userId, societyId);
    let authorRoleLabel = 'Resident';
    if (resident && resident.flat && resident.tower) {
      authorRoleLabel = `Resident · Flat ${resident.flat.flatNumber}, ${resident.tower.towerName}`;
    }

    return {
      authorName,
      authorRole: UserRoles.RESIDENTS,
      authorRoleLabel,
      authorAvatar,
    };
  }

  private async formatPost(post: PostDocument, currentUserId: string): Promise<SocialsPost> {
    const authorDetails = await this.formatAuthorDetails(post.createdBy, post.societyId);

    const formattedComments: SocialsComment[] = [];
    for (const c of post.comments) {
      const commentAuthor = await this.formatAuthorDetails(c.createdBy, post.societyId);
      const createdAtDate = c.createdAt || new Date();
      formattedComments.push({
        id: c.id,
        authorName: commentAuthor.authorName,
        authorRole: commentAuthor.authorRole,
        authorRoleLabel: commentAuthor.authorRoleLabel,
        authorAvatar: commentAuthor.authorAvatar,
        content: c.content,
        time: getRelativeTime(createdAtDate),
        createdAt: new Date(createdAtDate).toISOString(),
      });
    }

    const postCreatedAt = post.createdAt || new Date();

    return {
      id: post.id,
      authorName: authorDetails.authorName,
      authorRole: authorDetails.authorRole,
      authorRoleLabel: authorDetails.authorRoleLabel,
      authorAvatar: authorDetails.authorAvatar,
      time: getRelativeTime(postCreatedAt),
      content: post.content,
      images: post.images || [],
      likes: post.likedBy?.length || 0,
      commentsCount: post.comments?.length || 0,
      comments: formattedComments,
      hasLiked: post.likedBy?.includes(currentUserId) || false,
      createdAt: new Date(postCreatedAt).toISOString(),
    };
  }

  async create(dto: CreatePostDto, societyId: string, userId: string): Promise<SocialsPost> {
    const postData = {
      content: dto.content,
      images: dto.images || [],
      societyId,
      createdBy: userId,
      likedBy: [],
      comments: [],
    };

    const doc = await this.repository.create(postData);
    return this.formatPost(doc, userId);
  }

  async findAll(
    societyId: string,
    currentUserId: string,
    search?: string,
    role?: string,
    timeRange?: string,
    startDate?: string,
    endDate?: string
  ): Promise<SocialsPost[]> {
    const posts = await this.repository.find({ societyId });
    const formattedPosts: SocialsPost[] = [];
    for (const p of posts) {
      const formatted = await this.formatPost(p, currentUserId);

      // Search query filter
      if (search && search.trim()) {
        const query = search.toLowerCase();
        const contentMatch = formatted.content?.toLowerCase().includes(query);
        const nameMatch = formatted.authorName?.toLowerCase().includes(query);
        if (!contentMatch && !nameMatch) {
          continue;
        }
      }

      // Role filter
      if (role && role !== "all") {
        const roleMap: Record<string, string> = {
          resident: "RESIDENTS",
          admin: "ADMIN",
          guard: "GUARD",
        };
        if (formatted.authorRole !== roleMap[role]) {
          continue;
        }
      }

      // Time range filter
      if (timeRange && timeRange !== "all") {
        const postCreatedAt = p.createdAt || new Date();
        const postDate = new Date(postCreatedAt);
        const now = new Date();
        if (timeRange === "hour") {
          const limit = new Date(now.getTime() - 60 * 60 * 1000);
          if (postDate < limit) continue;
        } else if (timeRange === "day") {
          const limit = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          if (postDate < limit) continue;
        } else if (timeRange === "week") {
          const limit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (postDate < limit) continue;
        } else if (timeRange === "custom" && startDate) {
          const start = new Date(startDate);
          const end = endDate ? new Date(endDate) : now;
          if (postDate < start || postDate > end) continue;
        }
      }

      formattedPosts.push(formatted);
    }
    return formattedPosts;
  }

  async findOne(id: string, currentUserId: string): Promise<SocialsPost> {
    const post = await this.repository.findOne(id);
    if (!post) {
      throw new NotFoundException(`Socials post not found`);
    }
    return this.formatPost(post, currentUserId);
  }

  async addComment(id: string, dto: CreateCommentDto, userId: string): Promise<SocialsComment> {
    const post = await this.repository.findOne(id);
    if (!post) {
      throw new NotFoundException(`Socials post not found`);
    }

    const newComment = {
      createdBy: userId,
      content: dto.content,
    } as CommentModel;

    post.comments.push(newComment);
    const saved = await this.repository.save(post);

    // Find the saved comment to get its generated ID and timestamps
    const savedComment = saved.comments[saved.comments.length - 1];
    const authorDetails = await this.formatAuthorDetails(userId, post.societyId);

    const createdAtDate = (savedComment as any).createdAt || new Date();

    return {
      id: savedComment.id,
      authorName: authorDetails.authorName,
      authorRole: authorDetails.authorRole,
      authorRoleLabel: authorDetails.authorRoleLabel,
      authorAvatar: authorDetails.authorAvatar,
      content: savedComment.content,
      time: getRelativeTime(createdAtDate),
      createdAt: new Date(createdAtDate).toISOString(),
    };
  }

  async toggleLike(id: string, userId: string): Promise<SocialsPost> {
    const post = await this.repository.findOne(id);
    if (!post) {
      throw new NotFoundException(`Socials post not found`);
    }

    const isLiked = post.likedBy.includes(userId);
    if (isLiked) {
      post.likedBy = post.likedBy.filter((uid) => uid !== userId);
    } else {
      post.likedBy.push(userId);
    }

    const saved = await this.repository.save(post);
    return this.formatPost(saved, userId);
  }
}
