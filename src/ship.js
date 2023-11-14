class Ship {
  constructor(length) {
    this.length = length;
    this.num_hits = 0;
    this.is_sunk = false;
  }

  hit() {
    this.num_hits++;
    return this.num_hits;
  }

  isSunk() {
    if (this.num_hits === this.length) this.is_sunk = true;

    return this.is_sunk;
  }
}

export { Ship };
