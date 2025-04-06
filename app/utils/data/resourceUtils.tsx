import { JSX } from "react";
import {
  IconBook,
  IconVideo,
  IconHeadphones,
  IconWorld,
} from "@tabler/icons-react";
import { ResourceType } from "./resources";
import React from "react";

export const typeIcons: Record<ResourceType, JSX.Element> = {
  reading: <IconBook className="h-5 w-5" />,
  video: <IconVideo className="h-5 w-5" />,
  audio: <IconHeadphones className="h-5 w-5" />,
  interactive: <IconWorld className="h-5 w-5" />,
};

export const getIconForType = (type: ResourceType): JSX.Element =>
  typeIcons[type] || typeIcons.reading;
