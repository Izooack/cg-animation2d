import * as CG from './transforms.js';
import './matrix.js';
import { Matrix } from './matrix.js';

class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // limit_fps_flag:      bool 
    // fps:                 int
    constructor(canvas, limit_fps_flag, fps) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.limit_fps = limit_fps_flag;
        this.fps = fps;
        this.start_time = null;
        this.prev_time = null;

        this.models = {
            slide0: [
                // example model (diamond) -> should be replaced with actual model
                {
                    //for a circle centered at (300, 300) with a radius of 25
                    radius: 25,
                    velocityX: 50,
                    velocityY: 0,
                    vertices: [
                        CG.Vector3(300, 275, 1), // bottom
                        CG.Vector3(318, 282, 1), // bottom right
                        CG.Vector3(325, 300, 1), // right
                        CG.Vector3(318, 318, 1), // top right
                        CG.Vector3(300, 325, 1), // top
                        CG.Vector3(282, 318, 1), // 
                        CG.Vector3(275, 300, 1), // left
                        CG.Vector3(282, 282, 1)
                    ],
                    transform: new Matrix(3,3)
                }
            ],
            slide1: [
                // set up each of the vertices so they form at the origin
                {
                    vertices: [
                        CG.Vector3(100, 100, 1),
                        CG.Vector3(200, 100, 1),
                        CG.Vector3(150, 150, 1)
                    ],
                    transform: new Matrix(3,3)
                }
            ],
            slide2: [
                // set up each of the vertices so they form at the origin
                {
                    vertices: [
                        // Square about the origin
                        CG.Vector3(100, 100, 1),
                        CG.Vector3(100, -100, 1),
                        CG.Vector3(-100, 100, 1),
                        CG.Vector3(-100, -100, 1),
                        // Triangle about the origin
                        CG.Vector3(0, 150, 1),
                        CG.Vector3(-100, 0, 1),
                        CG.Vector3(100, 0, 1),
                        // Rectangle about the origin
                        CG.Vector3(200, 100, 1),
                        CG.Vector3(200, -100, 1),
                        CG.Vector3(-200, 100, 1),
                        CG.Vector3(-200, -100, 1),
                    ],
                    transform: new Matrix(3,3)
                }
            ],
            slide3: [
                // set up each of the vertices so they form at the origin
                {
                    vertices: [
                        // Square about the origin
                        CG.Vector3(100, 100, 1),
                        CG.Vector3(100, -100, 1),
                        CG.Vector3(-100, 100, 1),
                        CG.Vector3(-100, -100, 1),
                        // Triangle about the origin
                        CG.Vector3(0, 150, 1),
                        CG.Vector3(-100, 0, 1),
                        CG.Vector3(100, 0, 1),
                        // Rectangle about the origin
                        CG.Vector3(200, 100, 1),
                        CG.Vector3(200, -100, 1),
                        CG.Vector3(-200, 100, 1),
                        CG.Vector3(-200, -100, 1),
                    ],
                    transform: new Matrix(3,3)
                }
            ]
        };
    }

    // flag:  bool
    limitFps(flag) {
        this.limit_fps = flag;
    }

    // n:  int
    setFps(n) {
        this.fps = n;
    }

    // idx: int
    setSlideIndex(idx) {
        this.slide_idx = idx;
    }

    animate(timestamp) {
        // Get time and delta time for animation
        if (this.start_time === null) {
            this.start_time = timestamp;
            this.prev_time = timestamp;
        }
        let time = timestamp - this.start_time;
        let delta_time = timestamp - this.prev_time;
        //console.log('animate(): t = ' + time.toFixed(1) + ', dt = ' + delta_time.toFixed(1));

        // Update transforms for animation
        this.updateTransforms(time, delta_time);

        // Draw slide
        this.drawSlide();

        // Invoke call for next frame in animation
        if (this.limit_fps) {
            setTimeout(() => {
                window.requestAnimationFrame((ts) => {
                    this.animate(ts);
                });
            }, Math.floor(1000.0 / this.fps));
        }
        else {
            window.requestAnimationFrame((ts) => {
                this.animate(ts);
            });
        }

        // Update previous time to current one for next calculation of delta time
        this.prev_time = timestamp;
    }

    //
    updateTransforms(time, delta_time) {
        // TODO: update any transformations needed for animation
        // milliseconds
        // can calculate the balls transformation regardless of if its on slide0 or a different slide
        let timeSec = time / 1000;
        let nextPixelX = this.models.slide0[0].velocityX * timeSec;
        let nextPixelY = this.models.slide0[0].velocityY * timeSec;

        //define the points on the circle that we need to check for
        let rightPointX = Matrix.multiply([this.models.slide0[0].transform, this.models.slide0[0].vertices[2]]).values[0][0];
        let leftPointX = Matrix.multiply([this.models.slide0[0].transform, this.models.slide0[0].vertices[6]]).values[0][0];
        let topPointY = Matrix.multiply([this.models.slide0[0].transform, this.models.slide0[0].vertices[4]]).values[1][1];
        let bottomPointY = Matrix.multiply([this.models.slide0[0].transform, this.models.slide0[0].vertices[0]]).values[1][1];
        

        // check if circle is going off the the right or left of the screen, then reverse the x velocity
        //800 is the canvas width

        //if it hits the right wall, set velocity as negative
        if (rightPointX >= 800) {
            this.models.slide0[0].velocityX = -Math.abs(this.models.slide0[0].velocityX);
            nextPixelX = this.models.slide0[0].velocityX * timeSec;
        }

        //if it hits the left wall, set the velocity to positive
        else if(leftPointX <= 0){
            this.models.slide0[0].velocityX = Math.abs(this.models.slide0[0].velocityX);
            nextPixelX = this.models.slide0[0].velocityX * timeSec;
        }

        // Checks for the top or bottom of the screen
        else if (topPointY >= 600 || bottomPointY <= 0) {
            this.models.slide0.velocityY = this.models.slide0[0].velocityY * -1;

            nextPixelY = this.models.slide0[0].velocityY * timeSec;
        }

        CG.mat3x3Translate(this.models.slide0[0].transform, nextPixelX, nextPixelY);

        console.log("right point is " + rightPointX);
        console.log(this.models.slide0[0].velocityX);

    }
    
    //
    drawSlide() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0();
                break;
            case 1:
                this.drawSlide1();
                break;
            case 2:
                this.drawSlide2();
                break;
            case 3:
                this.drawSlide3();
                break;
        }
    }

    //
    drawSlide0() {
        // TODO: draw bouncing ball (circle that changes direction whenever it hits an edge)
        // Animate a ball (circle - i.e. polygon with enough sides to look like a circle) such that it bounces around the canvas.
        // The ball should have an initial velocity in both the x and y directions.
        // Whenever the ball hits a right/left edge, the x velocity should be reversed (i.e. negated).
        // Whenever the ball hits a bottom/top edge, the y velocity should be reversed (i.e. negated).

        // console.log() to print

        let green = [0, 255, 0, 255];
        let updatedVertices = [];

        // P' = T(tx, ty) * P. We are always multiplying by the original points (i.e. the vertices that are created)

        // loop through each of the vertices and multiply it by the multiply matrices function
        // to return the new vertices and then draw them
        for (let vertex of this.models.slide0[0].vertices) {
            // console.log(vertex);
            updatedVertices.push(Matrix.multiply([this.models.slide0[0].transform, vertex]));
        }
        this.drawConvexPolygon(updatedVertices, green);
        console.log(this.models.slide0[0].vertices[2].values[0][0]);

        
        // Following lines are example of drawing a single polygon
        // (this should be removed/edited after you implement the slide)
        // let teal = [0, 128, 128, 255];
        // this.drawConvexPolygon(this.models.slide0[0].vertices, teal);
    }

    //
    drawSlide1() {
        // TODO: draw at least 3 polygons that spin about their own centers
        //   - have each polygon spin at a different speed / direction
        // Animate one or more polygons that spin about their own center.
        // The velocity of the spin should be used to control direction
        // (clockwise vs. counter-clockwise) and speed (i.e. revolutions per second)

        let red = [255, 0, 0, 255];
        let green = [0, 255, 0, 255];
        let blue = [0, 0, 255, 255];

        let slow = 10;
        let medium = 50;
        let fast = 100;

        let rotatedVertices = [];

        for (let rotateVertex of this.models.slide1[0].vertices) {
            rotatedVertices.push(Matrix.multiply([this.models.slide1[0].transform, vertex]))
        }

        
    }

    //
    drawSlide2() {
        // TODO: draw at least 2 polygons grow and shrink about their own centers
        //   - have each polygon grow / shrink different sizes
        //   - try at least 1 polygon that grows / shrinks non-uniformly in the x and y directions
        // Animate one or more polygons that will repeatedly grow then shrink
        // about their own center. You should define both the rate at which
        // the polygons grow and shrink as well as the magnitude (in both x and y)
        // of the scaling

        let red = [255, 0, 0, 255];
        let green = [0, 255, 0, 255];
        let blue = [0, 0, 255, 255];

        let shrink = 0.5;
        let grow = 2;

        let scaledVertices = [];

        for (let scaleVertex of this.models.slide2[0].vertices) {
            scaledVertices.push(Matrix.multiply([this.models.slide2[0].transform, vertex]))
        }

    }

    //
    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        //     (translation, scaling, and rotation)
        
        
    }
    
    // vertex_list:  array of object [Matrix(3, 1), Matrix(3, 1), ..., Matrix(3, 1)]
    // color:        array of int [R, G, B, A]
    drawConvexPolygon(vertex_list, color) {
        this.ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] / 255) + ')';
        this.ctx.beginPath();
        let x = vertex_list[0].values[0][0] / vertex_list[0].values[2][0];
        let y = vertex_list[0].values[1][0] / vertex_list[0].values[2][0];
        this.ctx.moveTo(x, y);
        for (let i = 1; i < vertex_list.length; i++) {
            x = vertex_list[i].values[0][0] / vertex_list[i].values[2][0];
            y = vertex_list[i].values[1][0] / vertex_list[i].values[2][0];
            this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
};

export { Renderer };
