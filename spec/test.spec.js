import {Stream} from '../stream.js'

describe("A suite is just a function", function() {
  
    it("Test count", function() {
      const s = Stream.of([1, 2, 3])
  
      expect(s.count()).toBe(3);
    })

    it("Test count empty", function() {
      const s = Stream.of([])
  
      expect(s.count()).toBe(0);
    })    
})