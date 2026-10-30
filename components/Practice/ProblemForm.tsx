"use client";

import { MAX_LENGTH } from "@/lib/answers";
import { MathText } from "./MathText";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { submitAnswer, type AnswerResult } from "@/lib/actions/submit-answer";

type ProblemData = {
  id: string;
  type: "multiple_choice" | "student_response";
  prompt: string;
  choices: { id: string; body: string }[];
};

const letters = ["A", "B", "C", "D"];

export function ProblemForm({ problem }: { problem: ProblemData }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [state, formAction, pending] = useActionState<AnswerResult, FormData>(
    submitAnswer,
    { status: "idle" },
  );

  const graded = state.status === "correct" || state.status === "incorrect";

  const canSubmit =
    problem.type === "multiple_choice"
      ? selected !== null
      : answer.trim() !== "";
    function handleAction(formData: FormData){
      formData.set("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);
      formAction(formData)
    }
  return (
    <form action={handleAction}>
      <input type="hidden" name="problemId" value={problem.id} />

      <div>
        <MathText>{problem.prompt}</MathText>
      </div>

      {problem.type === "multiple_choice" ? (
        <fieldset disabled={graded}>
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
            disabled={graded}
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

      {state.status === "invalid" && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}

      {graded ? (
        <div>
          <p>{state.status === "correct" ? "Correct!" : "Not quite."}</p>
          {state.solutions.map((solution, index) => (
            <div key={index}>
              <p>Solution</p>
              <MathText>{solution}</MathText>
            </div>
          ))}
          <Button type="button" onClick={() => router.refresh()}>
            Next problem
          </Button>
        </div>
      ) : (
        <Button type="submit" disabled={!canSubmit || pending}>
          {pending ? "Checking..." : "Check answer"}
        </Button>
      )}
    </form>
  );
}
