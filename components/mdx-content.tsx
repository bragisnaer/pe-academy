"use client"

import * as runtime from "react/jsx-runtime"
import { createMdxComponents } from "@/components/mdx-components"

interface MdxContentProps {
  code: string
  /** Pass true to enable inline glossary term highlighting (first occurrence per render). */
  withGlossary?: boolean
}

// SECURITY NOTE: new Function() is used intentionally here. The `code` string is
// Velite-compiled MDX output — generated at build time from MDX files committed to
// the git repository by the project owner. It is NOT user-supplied content and cannot
// contain arbitrary input from external sources. This is the standard Velite MDX
// rendering pattern and is safe in this context.
// eslint-disable-next-line no-new-func
function getMDXComponent(code: string) {
  // Velite compiles MDX to a function body that receives jsx runtime as its argument
  // and returns { default: ComponentFunction }
  const fn = new Function(code) // nosec
  return fn({ ...runtime }).default as React.ComponentType<{
    components?: Record<string, React.ComponentType>
  }>
}

export function MdxContent({ code, withGlossary = false }: MdxContentProps) {
  const Component = getMDXComponent(code)
  // createMdxComponents() creates a fresh seenTerms Set per MdxContent render,
  // ensuring only the first occurrence of each term is highlighted per lesson page.
  const components = withGlossary ? createMdxComponents() : undefined
  return <Component components={components} />
}
