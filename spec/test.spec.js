import {Stream} from '../src/stream.js'

describe("Stream testing.", function() {
  
    it("Tests array stream", function() {
      const s = Stream.of([1, 2, 3, 4])

      expect(s.collect()).toEqual([1, 2, 3, 4]);
    })

    it("Tests iterator stream", function() {
      const m = new Map

      m.set("a", 1)
      m.set("b", 2)
      m.set("c", 3)

      expect(Stream.of(m.keys()).collect())
        .toEqual(["a", "b", "c"]);

      expect(Stream.of(m.values()).collect())
        .toEqual([1, 2, 3]);
    })

    it("Tests bad constructor", function() {
      try {
        const o = {
          "prop1": 1,
          "prop2": 2
        }

        Stream.of(o)

        fail("Should have thrown exception")
      } catch (error) {
      }
    })

    it("Tests empty array stream", function() {
      const s = Stream.of([])

      expect(s.collect()).toEqual([]);
    })

    it("Tests empty iterator stream", function() {
      const m = new Map

      expect(Stream.of(m.keys()).collect())
        .toEqual([]);

      expect(Stream.of(m.values()).collect())
        .toEqual([]);
    })

    it("Tests zipping", function() {
      let s1 = Stream.of([1, 2, 3, 4])
      let s2 = Stream.of(["One", "Two"])

      expect(Stream.zip([s1, s2]).collect()).toEqual([[1, "One"], [2, "Two"]]);

      let s3 = Stream.of(["One", "Two"])
      let s4 = Stream.of([1, 2, 3, 4])

      expect(Stream.zip([s3, s4]).collect()).toEqual([["One", 1], ["Two", 2]]);
    })

    it("Tests zipping empty streams", function() {
      const s1 = Stream.of([])
      const s2 = Stream.of([])

      expect(Stream.zip([s1, s2]).collect()).toEqual([]);
    })

    it("Tests forEach", function() {
      const list = [1, 2, 3, 4]
      const s = Stream.of(list)
      let idx = 0
      let count = 0

      s.forEach(x => {
        expect(list[idx++]).toBe(x);

        ++count
      })

      expect(count).toBe(list.length);
    })

    it("Tests empty forEach", function() {
      const list = []
      const s = Stream.of(list)
      let count = 0

      s.forEach(x => {
        ++count
      })

      expect(count).toBe(0);
    })

    it("Tests mapping", function() {
      const s = Stream
        .of([1, 2, 3, 4])
        .map(x => x * 2)
        .map(x => x - 1)

      expect(s.collect()).toEqual([1, 3, 5, 7]);
    })

    it("Tests flat mapping", function() {
      const s = Stream
        .of([1, 2, 3, 4])
        .flatMap(x => Stream.of([x, x * 2]))

      expect(s.collect()).toEqual([1, 2, 2, 4, 3, 6, 4, 8]);
    })

    it("Tests flat mapping empty stream", function() {
      const s = Stream
        .of([])
        .flatMap(x => Stream.of([x, x * 2]))

      expect(s.collect()).toEqual([]);
    })

    it("Tests filtering", function() {
      const s = Stream
        .of([1, 2, 3, 4, 5, 6])
        .filter(x => x % 2 == 0)
        .filter(x => x <= 4)

      expect(s.collect()).toEqual([2, 4]);
    })

    it("Tests filtering no match", function() {
      const s = Stream
        .of([1, 2, 3, 4, 5, 6])
        .filter(x => x < 0)
        .filter(x => x % 2 == 0)

      expect(s.collect()).toEqual([]);
    })

    it("Tests takeWhile", function() {
      const s = Stream
        .of([1, 2, 3, 4, 5, 6])
        .takeWhile(x =>x < 4)

      expect(s.collect()).toEqual([1, 2, 3]);
    })

    it("Tests skipWhile", function() {
      const s = Stream
        .of([1, 2, 3, 4, 5, 6])
        .skipWhile(x =>x < 4)

      expect(s.collect()).toEqual([4, 5, 6]);
    })

    it("Tests skip", function() {
      const s = Stream
        .of([1, 2, 3, 4, 5, 6])
        .skip(3)

      expect(s.collect()).toEqual([4, 5, 6]);
    })

    it("Tests skip too much", function() {
      const s = Stream
        .of([1, 2, 3, 4, 5, 6])
        .skip(30)

      expect(s.collect()).toEqual([]);
    })

    it("Tests limit", function() {
      const s = Stream
        .of([1, 2, 3, 4, 5, 6])
        .limit(3)

      expect(s.collect()).toEqual([1, 2, 3]);
    })

    it("Tests limit extremes", function() {
      const s1 = Stream
        .of([1, 2, 3, 4, 5, 6])
        .limit(30)

      expect(s1.collect()).toEqual([1, 2, 3, 4, 5, 6]);

      const s2 = Stream
        .of([1, 2, 3, 4, 5, 6])
        .limit(0)

      expect(s2.collect()).toEqual([]);
    })

    it("Tests anyMatch", function() {
      const s1 = Stream
        .of([1, 2, 3, 4, 5, 6])

      expect(s1.anyMatch(x => x == 3)).toBeTrue()

      const s2 = Stream
        .of([1, 2, 3, 4, 5, 6])

      expect(s2.anyMatch(x => x == 30)).toBeFalse()
    })

    it("Tests empty anyMatch", function() {
      const s = Stream.of([])

      expect(s.anyMatch(x => x == 3)).toBeFalse()
    })

    it("Tests noneMatch", function() {
      const s1 = Stream
        .of([1, 2, 3, 4, 5, 6])

      expect(s1.noneMatch(x => x == 30)).toBeTrue()

      const s2 = Stream
        .of([1, 2, 3, 4, 5, 6])

      expect(s2.noneMatch(x => x == 3)).toBeFalse()
    })

    it("Tests empty noneMatch", function() {
      const s = Stream.of([])

      expect(s.noneMatch(x => x == 3)).toBeTrue()
    })

    it("Tests findFirst", function() {
      const s1 = Stream.of([1, 2, 3, 4])

      expect(s1.findFirst(x => x == 3)).toBe(3)

      const s2 = Stream.of([1, 2, 3, 4])

      expect(s2.findFirst(x => x == 30)).toBeUndefined()

      const s3 = Stream.of([])

      expect(s3.findFirst(x => x == 30)).toBeUndefined()
    })

    it("Tests reduce", function() {
      const argList = []
      const v = Stream
        .of([1, 2, 3, 4])
        .reduce((reduced, x) => {
          const result = x + reduced
          argList.push([reduced, x, result])

          return result
        })

        expect(argList).toEqual([
          [2, 1, 3],
          [3, 3, 6],
          [6, 4, 10]
        ])

        expect(v).toBe(10)
    })

    it("Tests reduce with initial value", function() {
      const argList = []
      const v = Stream
        .of([1, 2, 3, 4])
        .reduce((reduced, x) => {
          const result = x + reduced
          argList.push([reduced, x, result])

          return result
        }, -1)

        expect(argList).toEqual([
          [-1, 1, 0],
          [0, 2, 2],
          [2, 3, 5],
          [5, 4, 9],
        ])

        expect(v).toBe(9)
    })

    it("Tests reduce with one value", function() {
      const argList = []
      const v = Stream
        .of([1])
        .reduce((reduced, x) => {
          const result = x + reduced
          argList.push([reduced, x, result])

          return result
        })

        expect(argList).toEqual([])

        expect(v).toBe(1)
    })

    it("Tests reduce with one value and initial value", function() {
      const argList = []
      const v = Stream
        .of([1])
        .reduce((reduced, x) => {
          const result = x + reduced
          argList.push([reduced, x, result])

          return result
        }, -1)

        expect(argList).toEqual([
          [-1, 1, 0]
        ])

        expect(v).toBe(0)
    })

    it("Tests reduce with empty stream", function() {
      const argList = []
      const v = Stream
        .of([])
        .reduce((reduced, x) => {
          const result = x + reduced
          argList.push([reduced, x, result])

          return result
        })

        expect(argList).toEqual([])

        expect(v).toBeUndefined()
    })

    it("Tests reduce with empty stream and initial value", function() {
      const argList = []
      const v = Stream
        .of([])
        .reduce((reduced, x) => {
          const result = x + reduced
          argList.push([reduced, x, result])

          return result
        }, -1)

        expect(argList).toEqual([])

        expect(v).toBe(-1)
    })

    it("Tests count", function() {
      const s = Stream.of([1, 2, 3])
  
      expect(s.count()).toBe(3);

      const c = Stream
        .of([1, 2, 3, 4, 5])
        .filter(x => x % 2 == 0)
        .count()

      expect(c).toBe(2);
    })

    it("Tests count of empty stream", function() {
      const s = Stream.of([])
  
      expect(s.count()).toBe(0);
    })    
})