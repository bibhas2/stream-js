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

    static of(list) {
        return new ArrayStream(list, undefined)
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

const s = Stream
    .of([1, 2, 3, 4, 5])
    .skip(1)
    .limit(2)
    .forEach(x => console.log(x))
