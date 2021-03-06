import {vec2} from 'gl-matrix';
import NoiseFxns from './noisefxns';

class City {
    width : number;
    height : number;
    grid : number[][];

    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;
        this.grid = [];
        this.initGrid();
        this.waterCheck();
        this.scatterPoints();
    }

    initGrid() {
        for (var i = 0; i < this.width; i++) {
            this.grid[i] = [];
            for (var j = 0; j < this.height; j++) {
                if (i % 10 == 0 || j % 10 == 0) {
                    this.grid[i][j] = 2;
                    // road?
                }
                else {
                    // no road
                    this.grid[i][j] = 1;
                }
            }
        }
    }

    waterCheck() {
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.width; j++) {
                let p : vec2 = vec2.fromValues(i,j);
                let st : vec2 = vec2.fromValues(p[0] + 1.0 / 2.0, p[1] + 1.0 /2.0);
                let nf : NoiseFxns = new NoiseFxns(p);
                let fbmn : number = nf.fbm(st)[0];
                let worley : number = nf.WorleyNoise(p);
                let worley2 : number = nf.WorleyNoise(vec2.fromValues(p[1],p[0]));
                worley2 /= fbmn * 2.8;
                worley2 += worley / 5.0;
                worley2 = 1.0 - worley2;
                worley2 = Math.min(Math.max(worley2, 0.0), 1.0);

                if (worley2 < 0.3) {
                    this.grid[i][j] = 4;
                }
            }
        }        
    }

    scatterPoints() {
        var numPoints = 50;
        for (var i = 0; i < numPoints; i++) {
            var random0 = Math.random();
            var random1 = Math.random();
            random0 *= this.width;
            random1 *= this.height;
            random0 = Math.floor(random0);    
            random1 = Math.floor(random1);
            if (random0 % 10 == 0 || random1 % 10 == 0 ||
                this.grid[random0][random1] == 4) {
                // over road; generate new point
                // or on water
                i--;
            }
            else {
                this.grid[random0][random1] = 3; // point 
            }
        }   
    }

    setVBO() : any {
        let t1Array: number[] = [];
        let t2Array: number[] = [];
        let t3Array: number[] = [];
        let t4Array: number[] = [];
        let colArray: number[] = [];

        let rad = 90 * Math.PI / 180;

        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (this.grid[i][j] != 0) {
                    t1Array.push(1);
                    t1Array.push(0);
                    t1Array.push(0);
                    t1Array.push(0);

                    t2Array.push(0);
                    t2Array.push(Math.cos(rad));
                    t2Array.push(Math.sin(rad));
                    t2Array.push(0);

                    t3Array.push(0);
                    t3Array.push(Math.sin(rad) * -1);
                    t3Array.push(Math.cos(rad));
                    t3Array.push(0);

                    t4Array.push((i - this.width/2)); // x transformation
                    t4Array.push(0);
                    t4Array.push((j - this.height/2)); // z transformation
                    t4Array.push(1);

                    if (this.grid[i][j] == 1) {
                        colArray.push(1);
                        colArray.push(1);
                        colArray.push(0);
                        colArray.push(1);
                    }
                    else if (this.grid[i][j] == 3) {
                        // point
                        colArray.push(1);
                        colArray.push(0);
                        colArray.push(1);
                        colArray.push(1);
                    }
                    else if (this.grid[i][j] == 4) {
                        // water
                        colArray.push(0);
                        colArray.push(0);
                        colArray.push(0);
                        colArray.push(1);
                    }
                    else {
                        colArray.push(0);
                        colArray.push(0);
                        colArray.push(0.5);
                        colArray.push(1);
                    }

                    
                }
            }
        }

        let t1: Float32Array = new Float32Array(t1Array);
        let t2: Float32Array = new Float32Array(t2Array);
        let t3: Float32Array = new Float32Array(t3Array);
        let t4: Float32Array = new Float32Array(t4Array);
        let col: Float32Array = new Float32Array(colArray);

        let outVBO: any = {};
        outVBO.transf1Array = t1;
        outVBO.transf2Array = t2;
        outVBO.transf3Array = t3;
        outVBO.transf4Array = t4;
        outVBO.colorsArray = col;

        return outVBO;
    }
}

export default City;