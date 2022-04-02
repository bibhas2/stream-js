# Stream.js
JavaScript Array has filter(), map() etc. methods. But they each create a new array. This adds unnecessary overhead. This stream library attempts to fix that problem. It has constant memory complexity. Meaning, processing a large array as a stream adds no extra memory overhead.

In addition to memory usage, there are plenty of other benefits to this stream library.

1. Adds support for skipping, limiting and zipping that are otherwise missing in an array.
2. Adds mapping, filtering, reduction etc. to any iterator object.

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

## Creating a Stream from an Iterator
Many JavaScript API support [the iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators). You can create a stream from them. 

The following sums up the values in a ``Map`` that are larger than 150.

```javascript
let m = new Map

m.set("a", 100)
m.set("b", 200)
m.set("c", 300)

let s = Stream.of(m.values())
    .filter(x => x > 150)
    .reduce((sum, x) => sum + x)

console.log(s)
```

That will print:

```
500
```

## Iterate Through a Stream
Use the ``forEach()`` method of a stream to receive all the values.

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

## Reducing a Stream
The ``reduce()`` method works the same way as JavaScript array reduce. The following code adds 1 to each value and then finds the maximum.

```javascript
let max = Stream.of([1, 2, 33, 4, 5])
    .map(x => x + 1)
    .reduce((lastMax, x) => lastMax > x ? lastMax : x)
    
console.log(max)
```

This will print:

```
34
```

Optionally, you can supply an initial reduced value. The following will de-duplicate an array of names.

```javascript
let s = Stream.of(["Earth", "Mars", "Jupiter", "Mars"])
    .reduce((theSet, x) => {
        theSet.add(x)

        return theSet
    }, new Set)

console.log(s)
```

This will print:

```
{ 'Earth', 'Mars', 'Jupiter' }
```

## Zipping Streams
To combine multiple streams use the ``zip()`` method.

The following example skips one value from each stream and then prints the rest.

```javascript
let s1 = Stream.of([1, 2, 3, 4, 5])
let s2 = Stream.of(["One", "Two", "Three"])

Stream.zip([s1, s2])
    .skip(1)
    .forEach(values => console.log(values))
```

This will print the following. Notice how the numbers 4 and 5 are ignored due to the dissimilar lengths of the streams.

```
[ 2, 'Two' ]
[ 3, 'Three' ]
```