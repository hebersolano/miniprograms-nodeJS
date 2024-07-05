/*
This Node program reads text from standard input, computes the frequency of each letter in that text, and displays a histogram of the most frequently used characters.
*/

import * as readline from "node:readline/promises";

// this class extends Map so that the get() method returns the specified value instead of null when the key is not in the map

class DefaultMap extends Map {
  private defaultValue: number;

  constructor(defaultValue: number) {
    super();
    this.defaultValue = defaultValue;
  }

  get(key: string) {
    if (this.has(key)) {
      return super.get(key);
    } else {
      return this.defaultValue;
    }
  }
}

// this class computes and displays letter frequency histograms
type HistogramEntry = [string, number];

class Histogram {
  letterCounts: DefaultMap;
  totalLetters: number;

  constructor() {
    this.letterCounts = new DefaultMap(0);
    this.totalLetters = 0;
  }

  // this function updates the histogram with the letters of text.
  add(text: string) {
    // remove whitespace from the text, and convert to uppercase
    text = text.replace(/\s/g, "").toUpperCase();
    // now loop though the characters of the text
    for (const character of text) {
      let count = this.letterCounts.get(character);
      this.letterCounts.set(character, count + 1);
      this.totalLetters++;
    }
  }

  // convert the histogram to a string that displays an ASCII graphic toString
  toString() {
    // convert the Map to an array of [key, value] arrays
    let entries = [...this.letterCounts];

    // sort the array by count, the alphabetically
    entries.sort((a: HistogramEntry, b: HistogramEntry) => {
      if (a[1] === b[1]) {
        return a[0] < b[0] ? -1 : 1;
      } else {
        return b[1] - a[1];
      }
    });

    // convert the counts to percentages
    for (const entry of entries) {
      entry[1] = (entry[1] / this.totalLetters) * 100;
    }

    // drop any entries less than 1%
    entries = entries.filter((entry) => entry[1] >= 1);

    // now convert each entry to a line of text
    let lines = entries.map(([letter, percentage]: HistogramEntry) => {
      return `${letter}: ${"#".repeat(Math.round(percentage))} ${percentage.toFixed(2)}%`;
    });

    // and return the concatenated lines, separated by newline characters
    return lines.join("\n");
  }
}

/*
This async (promise returning) function creates a Histogram object,
asynchronously reads chucks of text from standard input, and adds those chucks to the histogram. When it reaches the end of the stream, it returns this histogram 
*/
async function histogramFromStdin() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const text = await rl.question(`Write your text: `);
  rl.close();

  let histogram = new Histogram();

  histogram.add(text);

  return histogram;
}

histogramFromStdin().then((histogram) => console.log(histogram.toString()));
