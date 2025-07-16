---
title: Merge Sort In Go
slug: merge-sort-in-go
author: Mohammad Aziz
date: "2020-08-16"
description: "Using divide and conquer to build merge sort in Go"
tags:
  - sorting
  - merge-sort
  - go
  - divide-and-conquer
cover:
  image: blog/merge-sort-in-go/images/green-plant.jpg
  caption: "Photo by [Markus Spiske](https://unsplash.com/@markusspiske?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/sort?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText)"
---

## What is sorting?

Sorting is a way to organize data in certain order.

What are these orders?

It depends on the task and also on the type of data we are working with. For
example, for number you can sort them in ascending or descending order of their
values. And for text you can do the same based on the occurrence their character.

## What's a "merge" sort?

It is a way to sort any data in which we divide the given task in subtasks
(in half) and ultimately _merging_ those subtasks into one which gives us the
sorted list of the data which we want.

Here is a nice [gif](https://upload.wikimedia.org/wikipedia/commons/c/cc/Merge-sort-example-300px.gif)
from WikiPedia for more graphical explanation.

It follows the
[divide and conquer](https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm)
design paradigm.

## 👨‍💻 Let's write code

Suppose we have a list of array which holds integers. We will now write some Go
code which will sort the integers using merge sort.

Since merge sort uses divide and conquer technique, it recursively do a function
call to itself with the subtask and eventually merge the subtask into a single
value of the sorted data.

This is how the merge step looks like.

### 🧪 Writing the test case first

```go
package merge_sort

import (
	"reflect"
	"testing"
)

func TestMergeSort(t *testing.T) {
	var tests = []struct {
		message string
		in  []int
		out []int
	}{
		{
			"should return single value when input is single",
			[]int{3},
			[]int{3},
		},
		{
			"should sort values in random order",
			[]int{3, 1},
			[]int{1, 3},
		},
		{
			"should return empty array if the input is also empty",
			[]int{},
			[]int{},
		},
		{
			"should sort values with duplication",
			[]int{3, 2, 3},
			[]int{2, 3, 3},
		},
		{
			"should sort values with negative cases",
			[]int{-9, 2, 3, -3},
			[]int{-9, -3, 2, 3},
		},
	}

	for _, tt := range tests {
		t.Run(tt.message, func(t *testing.T) {
			MergeSort(tt.in, 0, len(tt.in) - 1)
			if reflect.DeepEqual(tt.in, tt.out) != true {
				t.Errorf("got %q, want %q", tt.in, tt.out)
			}
		})
	}
}
```

### Merge Step

```go
// Merge left and right arrays
// start - start index of the array
// middle - middle index of the array
// end - end index of the array
func Merge(input []int, start, middle, end int) {
	itemsAtLeftSide := middle - start + 1
	itemsAtRightSide := end - middle

	// creating arrays which holds one extra element then the
	// currently needed because of the sentinel assignment
	left := make([]int, itemsAtLeftSide + 1)
	right := make([]int, itemsAtRightSide + 1)

	// allocate elements in the left side of the array
	for i := 0; i < itemsAtLeftSide; i++ {
		left[i] = input[start + i]
	}

	// allocate elements in the right side of the array
	for j := 0; j < itemsAtRightSide; j++ {
		// adding one because because j index is staring from zero
		// which in most of the cases conflict with the value in
		// the left array, adding one removes the conflict element
		right[j] = input[middle + j + 1]
	}

	// sentinel assignments
	left[itemsAtLeftSide] = math.MaxInt64
	right[itemsAtRightSide] = math.MaxInt64

	for i, j, k := 0, 0, start; k <= end; k++ {
		if left[i] <= right[j] {
			// assign what is at the top of the left array
			input[k] = left[i]
			i++
		} else {
			// assign what is at the top of the right array
			input[k] = right[j]
			j++
		}
	}
}
```

### The Sorting Code

In merge sort the main part where we divide the task in half is simple. The real
meat is the merging step which we have mentioned above.

```go
func MergeSort(input []int, start, end int) {
	if start < end {
		// getting the middle value
		middle := (start + end) / 2

		// sort whatever in the left of the array
		MergeSort(input, start, middle)

		// sort whatever in the right of the array
		MergeSort(input, middle + 1, end)

		// merge left and right sorted values
		Merge(input, start, middle, end)
	}
}
```

### Playground Code 🏌️‍♂️

You can reach at the playground by [following the link](https://play.golang.org/p/OEE9daILbFz).
