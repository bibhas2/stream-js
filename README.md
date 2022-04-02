# Stream.js
JavaScript Array has filter(), map() etc. methods. But they each create a new array. This adds unnecessary overhead. This stream library attempts to fix that problem. It has constant memory complexity. Meaning, processing a large array as a stream adds no extra memory overhead.

The API is inspired by Java's Stream support.

Basic example:

```javascript
Stream
    .of([1, 2, 3, 4, 5])
    .skip(1)
    .map(x => x * 2)
    .forEach(x => console.log(x))
```

This will print:

```
4
6
8
10
```

## Creating a Stream from an Array

```javascript
const s = Stream.of([1, 2, 3, 4, 5])
```

Note: You can not store ``undefined`` in the array. An ``undefined`` value will end the stream.

## Iterate Through a Stream
```javascript
const s = Stream.of([1, 2, 3, 4, 5])

s.forEach(x => console.log(x))
```

This will print:

```
1
2
3
4
5
```

## Mapping Values

```javascript
const s = Stream.of(["hello", "wonderful", "world"])

s.map(x => x.toUpperCase())
    .forEach(x => console.log(x))
```

This will print:

```
HELLO
WONDERFUL
WORLD
```

## Filtering Values
```javascript
Stream.of([1, 2, 3, 4, 5])
    .map(x => x + 1)
    .filter(x => x % 2 == 0)
    .forEach(x => console.log(x))
```

This will print:

```
2
4
6
```

## Inspecting the Stream
For debugging and logging you can inspect the flow of values through the stream using ``peek()``.

```javascript
const s = Stream.of(["hello", "wonderful", "world"])
s
    .peek(x => console.log("Original:", x))
    .map(x => x.toUpperCase())
    .peek(x => console.log("Converted:", x))
    .forEach(x => console.log(x))
```

This will print:

```
Original: hello
Converted: HELLO
HELLO
Original: wonderful
Converted: WONDERFUL
WONDERFUL
Original: world
Converted: WORLD
WORLD
```

## Skipping Values

Use ``skip()`` to suppress first few values from reaching downstream.

```javascript
const s = Stream.of([1, 2, 3, 4, 5])
s.skip(2)
    .map(x => x * 2)
    .forEach(x => console.log(x))
```

This will print:

```
6
8
10
```

## Limiting the Stream
Using ``limit()`` you can control the maximum number of values delivered downstream.

```javascript
const s = Stream.of([1, 2, 3, 4, 5])
    .skip(1)
    .limit(3)
    .forEach(x => console.log(x))
```

This will print:

```
2
3
4
```

## Searching
To find out if any item in the stream matches a criteria use ``anyMatch()``. Note, when the first match is encountered then the stream is ended and the remaining values in the stream are not inspected.

```javascript
console.log("Contains 3:", Stream.of([1, 2, 3, 4, 5]).anyMatch(x => x == 3))
console.log("Contains 40:", Stream.of([1, 2, 3, 4, 5]).anyMatch(x => x == 40))
```

Prints:

```
Contains 3: true
Contains 40: false
```

The opposite is ``noneMatch()``. However, this one needs to inspect all values in the stream.

```javascript
console.log("Excludes 3:", Stream.of([1, 2, 3, 4, 5]).noneMatch(x => x == 3))
console.log("Excludes 40:", Stream.of([1, 2, 3, 4, 5]).noneMatch(x => x == 40))
```

Prints:

```
Excludes 3: false
Excludes 40: true
```

To search for a value in the stream use ``findFirst()``. It will return ``undefined`` if no value matching the criteria is found.

```javascript
console.log("Large:", Stream.of([1, 2, 33, 40, 5]).findFirst(x => x > 10))
console.log("Small:", Stream.of([1, 2, 33, 4, 5]).findFirst(x => x < 0))
```

Prints:

```
Large: 33
Small: undefined
```

## Get an Array from a Stream
Use ``collect()`` to convert a stream into an array.

```javascript
const s = Stream.of([1, 2, 3, 4, 5])
const a = s.skip(1)
    .limit(3)
    .collect()

console.log(a)
```

This will print:

```
[ 2, 3, 4 ]
```