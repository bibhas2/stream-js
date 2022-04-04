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

    it("Tests count", function() {
      const s = Stream.of([1, 2, 3])
  
      expect(s.count()).toBe(3);
    })

    it("Tests count of empty stream", function() {
      const s = Stream.of([])
  
      expect(s.count()).toBe(0);
    })    
})