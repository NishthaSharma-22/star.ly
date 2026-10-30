import Markdown from "react-markdown"
import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"
import "katex/dist/katex.min.css";

type MathTextProps = {
    children: string;
    inline?: boolean;
}

export function MathText({children, inline = false}: MathTextProps){
    return(
        <Markdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={inline ? {p: "span" }: undefined}
        >
            {children}
        </Markdown>
    )
}