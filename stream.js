class Stream {
    upstream = undefined
    processor = undefined

    constructor(us, pr) {
        this.upstream = us
        this.processor = pr
    }

    next() {
        return undefined
    }

    static of(source) {
        if (Array.isArray(source)) {
            return new ArrayStream(source, undefined)
        } else {
            return new IteratorStream(source, undefined)
        }
    }

    static zip(sourceList) {
        return new ZipStream(sourceList)
    }

    forEach(consumer) {
        let elem = undefined

        while ((elem = this.next()) !== undefined) {
            consumer(elem)
        }
    }

    map(mapper) {
        return new MapStream(this, mapper);
    }

    filter(filterProc) {
        return new FilterStream(this, filterProc);
    }

    peek(peekProc) {
        return new PeekStream(this, peekProc);
    }

    skip(count) {
        const s = new SkipStream(this, undefined);

        s.skipCount = count

        return s
    }

    limit(count) {
        const s = new LimitStream(this, undefined);

        s.limitCount = count

        return s
    }

    collect() {
        const list = []

        this.forEach(x => list.push(x))

        return list
    }

    anyMatch(pred) {
        let elem = undefined

        while ((elem = this.next()) !== undefined) {
            if (pred(elem)) {
                return true
            }
        }

        return false
    }

    noneMatch(pred) {
        let elem = undefined

        while ((elem = this.next()) !== undefined) {
            if (pred(elem)) {
                return false
            }
        }

        return true
    }

    findFirst(pred) {
        let elem = undefined

        while ((elem = this.next()) !== undefined) {
            if (pred(elem)) {
                return elem
            }
        }

        return undefined
    } 
    
    reduce(reducerFunc, reducedValue) {
        while (true) {
            const currentValue = this.next()

            if (currentValue === undefined) {
                //End of stream.
                return reducedValue
            }
            /*
            reducedValue can only be undefined in the first
            iteration. In that case we pick the second value from the stream.
            */
            reducedValue = reducedValue === undefined ? 
                this.next() : reducedValue
    
            if (reducedValue === undefined) {
                //This should only happen if stream 
                //has only one value
                return currentValue
            }
    
            reducedValue = reducerFunc(reducedValue, currentValue)  
            
            //Reducer should not return undefined. 
            //If it does do so we gracefully end processing
            if (reducedValue === undefined) {
                return undefined
            }
        }
    }
}

class ArrayStream extends Stream {
    index = 0

    next() {
        if (this.upstream === undefined || !Array.isArray(this.upstream)) {
            return undefined
        }
        if (this.index >= this.upstream.length) {
            return undefined
        }

        const result = this.upstream[this.index]

        this.index += 1

        return result
    }
}

class IteratorStream extends Stream {
    iterator = undefined

    constructor(source) {
        super(source)

        this.iterator = source[Symbol.iterator]()

        if (this.iterator === undefined) {
            throw Error("Stream source does not support iteration.")
        }
    }

    next() {
        if (this.upstream === undefined || this.iterator === undefined) {
            return undefined
        }

        const result = this.iterator.next()

        if (result.done === true) {
            return undefined
        }

        return result.value
    }
}

class ZipStream extends Stream {
    constructor(source) {
        super(source)

        if (!Array.isArray(this.upstream)) {
            throw Error("Zipping requires an array of Stream objects.")
        }
    }

    next() {
        if (this.upstream === undefined || this.upstream.length == 0) {
            return undefined
        }

        const result = Stream.of(this.upstream)
            .map(s => s.next())
            .collect()

        if (result.length < this.upstream.length) {
            //One of the streams ended early

            return undefined
        }

        return result
    }
}

class MapStream extends Stream {
    next() {
        if (this.upstream === undefined || this.processor === undefined) {
            return undefined
        }

        const elem = this.upstream.next()

        if (elem === undefined) {
            return undefined
        }

        const result = this.processor(elem)

        return result
    }
}

class PeekStream extends Stream {
    next() {
        if (this.upstream === undefined || this.processor === undefined) {
            return undefined
        }

        const elem = this.upstream.next()

        if (elem === undefined) {
            return undefined
        }

        this.processor(elem)

        return elem
    }
}

class FilterStream extends Stream {
    next() {
        if (this.upstream === undefined || this.processor === undefined) {
            return undefined
        }

        let elem = undefined
        
        while ((elem = this.upstream.next()) !== undefined) {
            const include = this.processor(elem)

            if (include) {
                return elem
            }
        }

        return undefined
    }
}

class SkipStream extends Stream {
    skipCount = 0

    next() {
        if (this.upstream === undefined) {
            return undefined
        }
        
        let elem = undefined

        for (elem = this.upstream.next(); this.skipCount > 0 && elem !== undefined; --this.skipCount, elem = this.upstream.next()) {
        }

        return elem
    }
}

class LimitStream extends Stream {
    limitCount = 0

    next() {
        if (this.upstream === undefined) {
            return undefined
        }
        
        if (this.limitCount > 0) {
            this.limitCount -= 1

            return this.upstream.next()
        }

        return undefined
    }
}

let s1 = Stream.of([1, 2, 3, 4, 5])
let s2 = Stream.of(["One", "Two", "Three"])

Stream.zip([s1, s2])
    .skip(1)
    .forEach(values => console.log(values))