<<<<<<< HEAD
import * as React from "react"
import renderer from "react-test-renderer"

import { ThemedText } from "../ui/ThemedText"

it("renders correctly", () => {
  const tree = renderer.create(<ThemedText>Snapshot test!</ThemedText>).toJSON()

  expect(tree).toMatchSnapshot()
})
=======
import * as React from "react"
import renderer from "react-test-renderer"

import { ThemedText } from "../ui/ThemedText"

it("renders correctly", () => {
  const tree = renderer.create(<ThemedText>Snapshot test!</ThemedText>).toJSON()

  expect(tree).toMatchSnapshot()
})
>>>>>>> 22703bd7fa6ddb9c5f3446763a1797c3b2ec69d8
