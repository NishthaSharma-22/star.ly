import Markdown, { Components } from "react-markdown"
import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"
import "katex/dist/katex.min.css";

type MathTextProps = {
    children: string;
    inline?: boolean;
}

function buildComponents(inline: boolean): Components {
  return {
    ...(inline ? { p: "span" } : {}),
    img: ({ src, alt }) =>
      typeof src === "string" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? ""}
          className={
            inline
              ? "inline-block max-h-32 w-auto rounded bg-white p-1 align-middle"
              : "my-3 h-auto max-w-full rounded bg-white p-2"
          }
        />
      ) : null,
  };
}    

export function MathText({children, inline = false}: MathTextProps){
    return(
        <Markdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={buildComponents(inline)}
        >
            {children}
        </Markdown>
    )
}