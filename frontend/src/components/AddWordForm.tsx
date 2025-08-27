import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddWordFormProps {
  onSave: (word: string, description: string, example: string) => void;
  onCancel: () => void;
}

const AddWordForm: React.FC<AddWordFormProps> = ({ onSave, onCancel }) => {
  const [word, setWord] = useState("");
  const [description, setDescription] = useState("");
  const [example, setExample] = useState("");
  const [wordError, setWordError] = useState("");
  const [descError, setDescError] = useState("");
  const [exampleError, setExampleError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let hasError = false;
    setWordError("");
    setDescError("");
    setExampleError("");
    if (!word) {
      setWordError("Word is required");
      hasError = true;
    }
    if (!description) {
      setDescError("Description is required");
      hasError = true;
    }
    if (!example) {
      setExampleError("Example is required");
      hasError = true;
    }
    if (hasError) return;
    onSave(word, description, example);
    setWord("");
    setDescription("");
    setExample("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-6 min-w-[320px]"
    >
      <h2 className="text-lg font-semibold text-blue-600 mb-4">Add Word</h2>
      <div className="flex flex-col gap-4">
        <div>
          <Input
            placeholder="Word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className={wordError ? "border-red-500" : ""}
          />
          {wordError && (
            <p className="text-red-500 text-sm mt-1">{wordError}</p>
          )}
        </div>
        <div>
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={descError ? "border-red-500" : ""}
          />
          {descError && (
            <p className="text-red-500 text-sm mt-1">{descError}</p>
          )}
        </div>
        <div>
          <Input
            placeholder="Example"
            value={example}
            onChange={(e) => setExample(e.target.value)}
            className={exampleError ? "border-red-500" : ""}
          />
          {exampleError && (
            <p className="text-red-500 text-sm mt-1">{exampleError}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="submit">Save</Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddWordForm;
