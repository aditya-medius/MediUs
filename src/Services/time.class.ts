export class time {
  // h: number;
  // m: number;
  constructor(public h: number, public m: number) {
    // this.h = h;
    // this.m = m;
  }

  lessThan(t: time): boolean | undefined {
    if (this.h > t.h) {
      return false;
    } else if (this.h < t.h) {
      return true;
    } else if (this.h == t.h) {
      if (Math.abs(this.m - t.m) > 15) {
        if (this.m > t.m || this.m == t.m) {
          return false;
        } else return true;
      } else {
        throw new Error("Timings must be greate than 15 mins");
      }
    }
  }

  greaterThan(t: time): boolean | undefined {
    if (this.h < t.h) {
      return false;
    } else if (this.h > t.h) {
      return true;
    } else if (this.h == t.h) {
      if (Math.abs(this.m - t.m) > 15) {
        if (this.m < t.m || this.m == t.m) {
          return false;
        } else return true;
      } else {
        throw new Error("Timings must be greate than 15 mins");
      }
    }
  }
}
