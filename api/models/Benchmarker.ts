import moment from "moment";
import path from "node:path";
import fs from "node:fs";

const BENCHMARK_PATH = path.join(process.cwd(), "benchmarks");

export class Benchmark {
  private stream: fs.WriteStream;
  private startTimes: Record<string, moment.Moment> = {};

  constructor(name: string) {
    const benchmarkFilePath = path.join(BENCHMARK_PATH, `${name}.yaml`);
    this.stream = fs.createWriteStream(benchmarkFilePath);
    try {
      const file = fs.readFileSync(benchmarkFilePath);
      if (file) this.stream.write(file.toString());
    } catch (e) {
      //
    }
    this.stream.write(`Benchmark (${moment().format("L")} - ${moment().format("LTS")}):\n`);
  }

  public write(string: string, indent: number = 0) {
    const indentation = " ".repeat(indent);
    this.stream.write(`${indentation}${string}\n`);
  }

  public start(id: string) {
    this.startTimes[id] = moment();
  }
  public end(id: string, indent: number = 0) {
    const indentation = " ".repeat(indent);
    const startTime = this.startTimes[id];
    const elapsedTime = moment().diff(startTime) / 1000;
    this.stream.write(`${indentation}${id}: ${elapsedTime}s\n`);
  }
}
