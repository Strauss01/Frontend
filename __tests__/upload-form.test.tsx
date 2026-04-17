/**
 * DropzoneUpload component tests.
 *
 * We mock useUploadDocument so we don't need a real API.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the hook before importing the component
const mockMutate = vi.fn();
const mockUpload = {
  mutate: mockMutate,
  isPending: false,
};

vi.mock("@/features/documents/hooks", () => ({
  useUploadDocument: () => mockUpload,
}));

// react-dropzone needs a DOM environment with File support
import { DropzoneUpload } from "@/features/documents/components/DropzoneUpload";

function makeFile(name = "test.pdf", type = "application/pdf") {
  return new File(["dummy content"], name, { type });
}

describe("DropzoneUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the dropzone upload area", () => {
    render(<DropzoneUpload />);
    expect(
      screen.getByText(/drag & drop or click to browse/i)
    ).toBeInTheDocument();
  });

  it("shows the file name after a file is dropped", async () => {
    render(<DropzoneUpload />);
    const input = screen.getByLabelText(/file upload/i);

    const file = makeFile("contract.pdf");
    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText("contract.pdf")).toBeInTheDocument();
    });
  });

  it("calls upload.mutate with the selected file when Upload is clicked", async () => {
    render(<DropzoneUpload />);
    const input = screen.getByLabelText(/file upload/i);

    const file = makeFile("brief.pdf");
    await userEvent.upload(input, file);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /upload/i })).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole("button", { name: /upload/i }));
    expect(mockMutate).toHaveBeenCalledWith(file, expect.any(Object));
  });

  it("clears selected file when the remove button is clicked", async () => {
    render(<DropzoneUpload />);
    const input = screen.getByLabelText(/file upload/i);

    const file = makeFile("motion.pdf");
    await userEvent.upload(input, file);

    await waitFor(() =>
      expect(screen.getByText("motion.pdf")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole("button", { name: /remove file/i }));

    await waitFor(() =>
      expect(screen.queryByText("motion.pdf")).not.toBeInTheDocument()
    );
  });

  it("does not call mutate when no file is selected", () => {
    render(<DropzoneUpload />);
    // Upload button only renders when a file is picked — confirm it's absent
    expect(
      screen.queryByRole("button", { name: /^upload$/i })
    ).not.toBeInTheDocument();
  });
});
