"use client";

import { PlusSquareIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SnippetFormDialog } from "./snippet-form-dialog";

export const AddCodeSnippetDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Add Snippet
        <PlusSquareIcon weight="duotone" />
      </Button>

      <SnippetFormDialog open={open} onOpenChange={setOpen} mode="add" />
    </>
  );
};

export default AddCodeSnippetDialog;
