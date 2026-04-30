import { z } from "zod";

import type { ActionResult } from "@/lib/validation/common";

type FileValidationOptions = {
  required?: boolean;
  maxSizeInBytes: number;
  allowedTypes: string[];
};

export function getFileFromFormData(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

export function validateFile(
  file: File | null,
  key: string,
  options: FileValidationOptions,
): ActionResult | null {
  if (!file) {
    if (options.required) {
      return {
        status: "error",
        fieldErrors: {
          [key]: ["A file is required."],
        },
      };
    }

    return null;
  }

  if (!options.allowedTypes.includes(file.type)) {
    return {
      status: "error",
      fieldErrors: {
        [key]: ["That file type is not allowed."],
      },
    };
  }

  if (file.size > options.maxSizeInBytes) {
    return {
      status: "error",
      fieldErrors: {
        [key]: ["That file is larger than the allowed size."],
      },
    };
  }

  return null;
}

export const imageAltTextSchema = z.string().trim().max(120).optional();
