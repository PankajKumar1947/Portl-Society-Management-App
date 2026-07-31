import React from "react";
import { Badge } from "@/components/ui/badge";
import { VISITOR_STATUS } from "@repo/schema";

export interface VisitorStatusBadgeProps {
  status: string;
  isResidentCategory?: boolean;
  style?: any;
}

export const VisitorStatusBadge: React.FC<VisitorStatusBadgeProps> = ({
  status,
  isResidentCategory = false,
  style,
}) => {
  if (isResidentCategory) {
    const isInside = status === "active";
    return (
      <Badge variant={isInside ? "success" : "secondary"} style={style}>
        {isInside ? "Inside" : "Outside"}
      </Badge>
    );
  }

  switch (status) {
    case "active":
      return (
        <Badge variant="success" style={style}>
          Inside
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="secondary" style={style}>
          Checked Out
        </Badge>
      );
    case VISITOR_STATUS.APPROVED:
      return (
        <Badge variant="success" style={style}>
          Approved
        </Badge>
      );
    case VISITOR_STATUS.PENDING:
      return (
        <Badge variant="warning" style={style}>
          Pending
        </Badge>
      );
    case VISITOR_STATUS.REJECTED:
      return (
        <Badge variant="danger" style={style}>
          Declined
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" style={style}>
          {status.toUpperCase()}
        </Badge>
      );
  }
};
