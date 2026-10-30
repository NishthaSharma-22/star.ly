"use client";

import { MAX_LENGTH } from "@/lib/answers";
import { MathText } from "./MathText";
import { useState } from "react";
import { Button } from "../ui/button";

type ProblemData = {
  id: string;
  type: "multiple_choice" | "student_response";
  prompt: string;
  choices: { id: string; body: string }[];
};

const letters = ["A", "B", "C", "D"];

export function ProblemForm({ problem }: { problem: ProblemData }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");

  const canSubmit =
    problem.type === "multiple_choice"
      ? selected !== null
      : answer.trim() !== "";
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <div>
        <MathText>{problem.prompt}</MathText>
      </div>

      {problem.type === "multiple_choice" ? (
        <fieldset>
          <legend>Answer Choices</legend>
          {problem.choices.map((choice, index) => (
            <label
              key={choice.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition hover:bg-muted focus-within:ring-2 ${
                selected === choice.id ? "border-primary" : ""
              }`}
            >
              <input
                type="radio"
                name="choice"
                value={choice.id}
                checked={selected === choice.id}
                onChange={() => setSelected(choice.id)}
                className="sr-only"
              />
              <span className="font-semibold">{letters[index]}</span>
              <MathText inline>{choice.body}</MathText>
            </label>
          ))}
        </fieldset>
      ) : (
        <div>
          <label htmlFor="answer" className="text-sm text-muted-foreground">
            Your answer
          </label>
          <input
            type="text"
            id="answer"
            name="answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            maxLength={MAX_LENGTH + 1}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className="w-40 border p-3 rounded-lg"
          />
          <p>
            Enter a whole number, a decimal or an exact fraction. Mixed
            fractions are not allowed.
          </p>
        </div>
      )}
      <Button type="submit" disabled={!canSubmit}>
        Check Answer
      </Button>
    </form>
  );
}
