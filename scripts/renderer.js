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
                    velocityX: 100,
                    velocityY: 60,
                    vertices: [
                        CG.Vector3(300, 275, 1), // bottom
                        CG.Vector3(318, 282, 1), // bottom right
                        CG.Vector3(325, 300, 1), // right
                        CG.Vector3(318, 318, 1), // top right
                        CG.Vector3(300, 325, 1), // top
                        CG.Vector3(282, 318, 1), // top left
                        CG.Vector3(275, 300, 1), // left
                        CG.Vector3(282, 282, 1)  // bottom left
                    ],
                    currentVertices: [
                        CG.Vector3(300, 275, 1), // bottom
                        CG.Vector3(318, 282, 1), // bottom right
                        CG.Vector3(325, 300, 1), // right
                        CG.Vector3(318, 318, 1), // top right
                        CG.Vector3(300, 325, 1), // top
                        CG.Vector3(282, 318, 1), // top left
                        CG.Vector3(275, 300, 1), // left
                        CG.Vector3(282, 282, 1)  // bottom left
                    ],
                    transform: new Matrix(3,3)
                }
            ],
            slide1: [
                // set up each of the vertices so they form at the origin
                {
                    //velocities are in radians per second
                    velocityFast: Math.PI/4,
                    velocityMedium: Math.PI/8,
                    velocitySlow: Math.PI/16,
                    velocityReverseFast: -Math.PI/4,
                    velocityReverseMedium: -Math.PI/8,
                    velocityReverseSlow: -Math.PI/16,
                    squareVertices: [
                        // Square about the origin
                        CG.Vector3(100, 100, 1),
                        CG.Vector3(100, -100, 1),
                        CG.Vector3(-100, -100, 1),
                        CG.Vector3(-100, 100, 1),
                    ],
                    triangleVertices: [
                        // Triangle about the origin
                        CG.Vector3(0, 50, 1),
                        CG.Vector3(-50, -50, 1),
                        CG.Vector3(50, -50, 1),
                    ],
                    rectangleVertices: [
                        // Rectangle about the origin
                        CG.Vector3(200, 100, 1),
                        CG.Vector3(200, -100, 1),
                        CG.Vector3(-200, -100, 1),
                        CG.Vector3(-200, 100, 1),
                    ],
                    squareTransform: new Matrix(3,3),
                    triangleTransform: new Matrix(3,3),
                    rectangleTransform: new Matrix(3,3)
                }
            ],
            slide2: [
                // set up each of the vertices so they form at the origin
                {
                    squareShrink: .8,
                    triangleGrow: 1.05,
                    rectangleShrinkX: .9,
                    rectangleGrowY: 1.3,
                    squareVertices: [
                        // Square about the origin
                        CG.Vector3(100, 100, 1),
                        CG.Vector3(100, -100, 1),
                        CG.Vector3(-100, -100, 1),
                        CG.Vector3(-100, 100, 1),
                    ],
                    currentSquareVertices: [
                        // Square about the origin
                        CG.Vector3(100, 100, 1),
                        CG.Vector3(100, -100, 1),
                        CG.Vector3(-100, -100, 1),
                        CG.Vector3(-100, 100, 1),
                    ],
                    rectangleVertices: [
                        // Rectangle about the origin
                        CG.Vector3(20, 10, 1),
                        CG.Vector3(20, -10, 1),
                        CG.Vector3(-20, -10, 1),
                        CG.Vector3(-20, 10, 1),
                    ],
                    currentRectangleVertices: [
                        // Rectangle about the origin
                        CG.Vector3(200, 100, 1),
                        CG.Vector3(200, -100, 1),
                        CG.Vector3(-200, -100, 1),
                        CG.Vector3(-200, 100, 1),
                    ],
                    squareTransform: new Matrix(3,3),
                    rectangleTransform: new Matrix(3,3)
                }
            ],
            slide3: [
                {
                    tooth_1_velocityX: 0,
                    tooth_1_velocityY: -25,
                    tooth_1_vertices: [
                        // Triangle
                        CG.Vector3(250, 250, 1),
                        CG.Vector3(300, 250, 1),
                        CG.Vector3(275, 200, 1),
                    ],
                    tooth_1_currentVertices: [
                        // Triangle
                        CG.Vector3(250, 250, 1),
                        CG.Vector3(300, 250, 1),
                        CG.Vector3(275, 200, 1),
                    ],
                    tooth_2_vertices: [
                        // Triangle
                        CG.Vector3(350, 250, 1),
                        CG.Vector3(400, 250, 1),
                        CG.Vector3(375, 200, 1),
                    ],
                    tooth_2_currentVertices: [
                        // Triangle
                        CG.Vector3(350, 250, 1),
                        CG.Vector3(400, 250, 1),
                        CG.Vector3(375, 200, 1),
                    ],

                    mouthShrink: .9,
                    mouthVertices: [
                        CG.Vector3(200, 250, 1),
                        CG.Vector3(450, 250, 1),
                        CG.Vector3(450, 100, 1),
                        CG.Vector3(200, 100, 1)
                    ],
                    eye_1_vertices: [
                        CG.Vector3(200, 400, 1),
                        CG.Vector3(275, 400, 1),
                        CG.Vector3(275, 325, 1),
                        CG.Vector3(200, 325, 1)
                    ],
                    eye_2_vertices: [
                        CG.Vector3(325, 400, 1),
                        CG.Vector3(400, 400, 1),
                        CG.Vector3(400, 325, 1),
                        CG.Vector3(325, 325, 1)
                    ],
                    pupilRotateSpeed: Math.PI,
                    pupil_1_vertices: [
                        CG.Vector3(-4, 4, 1),
                        CG.Vector3(4, 4, 1),
                        CG.Vector3(4, -4, 1),
                        CG.Vector3(-4, -4, 1)
                    ],

                    transformTeeth: new Matrix(3,3),
                    transformMouth: new Matrix(3,3),
                    transformPupil: new Matrix(3,3)
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
        this.updateSlide0(time, delta_time);
        this.updateSlide1(time, delta_time);
        this.updateSlide2(time, delta_time);
        this.updateSlide3(time, delta_time);

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
    updateSlide0(time, delta_time) {
        // TODO: update any transformations needed for animation
        // milliseconds
        // can calculate the balls transformation regardless of if its on slide0 or a different slide
        let delta_timeSec = delta_time / 1000;
        let nextPixelX = this.models.slide0[0].velocityX * delta_timeSec;
        let nextPixelY = this.models.slide0[0].velocityY * delta_timeSec;

        //define the points on the circle that would be involved with hitting the walls
        let rightPointX = this.models.slide0[0].currentVertices[2].values[0][0];
        let leftPointX = this.models.slide0[0].currentVertices[6].values[0][0];
        let topPointY = this.models.slide0[0].currentVertices[4].values[1][0];
        let bottomPointY = this.models.slide0[0].currentVertices[0].values[1][0];


        // check if circle is going off the the right or left of the screen, then reverse the x velocity
        //800 is the canvas width

        //if it hits the right wall, set velocity X as negative
        if (rightPointX >= 800) {
            this.models.slide0[0].velocityX = -Math.abs(this.models.slide0[0].velocityX);
            nextPixelX = this.models.slide0[0].velocityX * delta_timeSec;
        }

        //if it hits the left wall, set the velocity X to positive
        else if(leftPointX <= 0){
            this.models.slide0[0].velocityX = Math.abs(this.models.slide0[0].velocityX);
            nextPixelX = this.models.slide0[0].velocityX * delta_timeSec;
        }

        //if it hits the top wall, set velocity Y as negative
        else if (topPointY >= 600) {
            this.models.slide0[0].velocityY = -Math.abs(this.models.slide0[0].velocityY);
            nextPixelY = this.models.slide0[0].velocityY * delta_timeSec;
        }

        //if it hits the bottom wall, set velocity Y as positive
        else if (bottomPointY <= 0){
            this.models.slide0[0].velocityY = Math.abs(this.models.slide0[0].velocityY);
            nextPixelY = this.models.slide0[0].velocityY * delta_timeSec;
        }

        CG.mat3x3Translate(this.models.slide0[0].transform, nextPixelX, nextPixelY);

    }

    //
    updateSlide1(time, delta_time) {
        let timeSec = time / 1000;

        let thetaFast = this.models.slide1[0].velocityFast * timeSec;
        // let nextPixelMedium = this.models.slide1[0].velocityMedium * timeSec;
        let thetaSlow = this.models.slide1[0].velocitySlow * timeSec;

        // let nextPixelReverseFast = this.models.slide1[0].velocityReverseFast * timeSec;
        // let nextPixelReverseMedium = this.models.slide1[0].velocityReverseMedium * timeSec;
        let thetaReverseSlow = this.models.slide1[0].velocityReverseMedium * timeSec;

        CG.mat3x3Rotate(this.models.slide1[0].squareTransform, thetaFast);
        CG.mat3x3Rotate(this.models.slide1[0].triangleTransform, thetaSlow);
        CG.mat3x3Rotate(this.models.slide1[0].rectangleTransform, thetaReverseSlow);
        console.log(this.models.slide1[0].triangleTransform);
        console.log(this.models.slide1[0].rectangleTransform);

    }
    
    //
    updateSlide2(time, delta_time) {
        let delta_timeSec = delta_time / 1000;

        //because of the unit being per second, the shrinking factor should be (1-velocity*time), growing be (1+velocity*time)
        let squareMovement = 1 - this.models.slide2[0].squareShrink * delta_timeSec;
        let rectangleXMovement = 1 - this.models.slide2[0].rectangleShrinkX * delta_timeSec;
        let rectangleYMovement = 1 + this.models.slide2[0].rectangleGrowY * delta_timeSec;

        CG.mat3x3Scale(this.models.slide2[0].squareTransform, squareMovement, squareMovement);
        CG.mat3x3Scale(this.models.slide2[0].rectangleTransform, rectangleXMovement, rectangleYMovement);

    }

    updateSlide3(time, delta_time) {
        //for the teeth
        let timeSec = time/1000;
        let delta_timeSec = delta_time / 1000;
        let nextPixelY = this.models.slide3[0].tooth_1_velocityY* delta_timeSec;

        let topPointY = this.models.slide3[0].tooth_1_currentVertices[0].values[1][0];
        let bottomPointY = this.models.slide3[0].tooth_1_currentVertices[2].values[1][0];

        //if it hits the right wall, set velocity X as negative
        if (bottomPointY <= 150) {
            this.models.slide3[0].tooth_1_velocityY = Math.abs(this.models.slide0[0].velocityX);
            nextPixelY = this.models.slide3[0].tooth_1_velocityY * delta_timeSec;
        }

        //if it hits the left wall, set the velocity X to positive
        else if(topPointY >= 250){
            this.models.slide3[0].tooth_1_velocityY = -Math.abs(this.models.slide0[0].velocityX);
            nextPixelY = this.models.slide3[0].tooth_1_velocityY * delta_timeSec;
        }

        CG.mat3x3Translate(this.models.slide3[0].transformTeeth, 0, nextPixelY);


        //for the eyes
        let theta = this.models.slide3[0].pupilRotateSpeed * timeSec;
        CG.mat3x3Rotate(this.models.slide3[0].transformPupil, theta);

        //for the mouth
        let mouthMovement = 1 - this.models.slide2[0].squareShrink * delta_timeSec;

    }

    
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

        // P' = T(tx, ty) * P. We are always multiplying by the original points (i.e. the vertices that are created)

        // loop through each of the vertices and multiply it by the multiply matrices function
        // to return the new vertices and then draw them
        for (let i = 0; i < this.models.slide0[0].vertices.length; i++) {
            // console.log(vertex);
            this.models.slide0[0].currentVertices[i] = Matrix.multiply([this.models.slide0[0].transform, this.models.slide0[0].currentVertices[i]]);
        }
        this.drawConvexPolygon(this.models.slide0[0].currentVertices, green);

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

        //define the array to hold the square, triangle, and rectangle points, and to move it off the center
        let drawSquare = [0, 0, 0, 0];
        let moveSquare = new Matrix(3,3);
        CG.mat3x3Translate(moveSquare, 150, 150);

        let drawTriangle = [0, 0, 0];
        let moveTriangle = new Matrix(3,3);
        CG.mat3x3Translate(moveTriangle, 200, 500);

        let drawRectangle = [0, 0, 0, 0];
        let moveRectangle = new Matrix(3,3);
        CG.mat3x3Translate(moveRectangle, 500, 200);

        //update and draw the square
        for (let i = 0; i < this.models.slide1[0].squareVertices.length; i++) {
            drawSquare[i] = Matrix.multiply([moveSquare, Matrix.multiply([this.models.slide1[0].squareTransform, this.models.slide1[0].squareVertices[i]])]);
        }
        this.drawConvexPolygon(drawSquare, blue);

        //update and draw the triangle
        for (let i = 0; i < this.models.slide1[0].triangleVertices.length; i++) {
            drawTriangle[i] = Matrix.multiply([moveTriangle, Matrix.multiply([this.models.slide1[0].triangleTransform, this.models.slide1[0].triangleVertices[i]])]);
        }
        this.drawConvexPolygon(drawTriangle, red);

        //update and draw the rectangle
        for (let i = 0; i < this.models.slide1[0].rectangleVertices.length; i++) {
            drawRectangle[i] = Matrix.multiply([moveRectangle, Matrix.multiply([this.models.slide1[0].rectangleTransform, this.models.slide1[0].rectangleVertices[i]])]);
        }
        this.drawConvexPolygon(drawRectangle, green);
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

        let moveSquare = new Matrix(3,3);
        CG.mat3x3Translate(moveSquare, 150, 150);
        let drawSquare = [0, 0, 0, 0];

        let moveRectangle = new Matrix(3,3);
        CG.mat3x3Translate(moveRectangle, 400, 450);
        let drawRectangle = [0, 0, 0, 0];

        for (let i = 0; i < this.models.slide2[0].squareVertices.length; i++) {
            this.models.slide2[0].currentSquareVertices[i] = Matrix.multiply([this.models.slide2[0].squareTransform, this.models.slide2[0].currentSquareVertices[i]]);
            drawSquare[i] = Matrix.multiply([moveSquare, this.models.slide2[0].currentSquareVertices[i]]);
        }
        this.drawConvexPolygon(drawSquare, blue);
        
        for (let i = 0; i < this.models.slide2[0].rectangleVertices.length; i++) {
            this.models.slide2[0].currentRectangleVertices[i] = Matrix.multiply([this.models.slide2[0].rectangleTransform, this.models.slide2[0].currentRectangleVertices[i]]);
            drawRectangle[i] = Matrix.multiply([moveRectangle, this.models.slide2[0].currentRectangleVertices[i]]);
        }
        this.drawConvexPolygon(drawRectangle, green);
    }

    //
    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        //     (translation, scaling, and rotation)

        for (let i = 0; i < this.models.slide3[0].tooth_1_vertices.length; i++) {
            // console.log(vertex);
            this.models.slide3[0].tooth_1_currentVertices[i] = Matrix.multiply([this.models.slide3[0].transformTeeth, this.models.slide3[0].tooth_1_currentVertices[i]]);
            this.models.slide3[0].tooth_2_currentVertices[i] = Matrix.multiply([this.models.slide3[0].transformTeeth, this.models.slide3[0].tooth_2_currentVertices[i]]);
        }
        this.drawConvexPolygon(this.models.slide3[0].tooth_1_currentVertices, [232, 237, 234, 255]);
        this.drawConvexPolygon(this.models.slide3[0].tooth_2_currentVertices, [232, 237, 234, 255]);

        //draw the eyes
        this.drawConvexPolygon(this.models.slide3[0].eye_1_vertices, [247, 237, 237, 255]);
        this.drawConvexPolygon(this.models.slide3[0].eye_2_vertices, [247, 237, 237, 255]);

        //draw the pupils
        let drawPup1 = [0, 0, 0, 0];
        let drawPup2 = [0, 0, 0, 0];
        let movePup1 = new Matrix(3,3);
        let movePup2 = new Matrix(3,3);
        CG.mat3x3Translate(movePup1, 242, 358);
        CG.mat3x3Translate(movePup2, 358, 358);

        for (let i = 0; i < this.models.slide3[0].pupil_1_vertices.length; i++) {
            drawPup1[i] = Matrix.multiply([movePup1, Matrix.multiply([this.models.slide3[0].transformPupil, this.models.slide3[0].pupil_1_vertices[i]])]);
        }
        this.drawConvexPolygon(drawPup1, [255, 0, 0, 255]);

        for (let i = 0; i < this.models.slide3[0].pupil_1_vertices.length; i++) {
            drawPup2[i] = Matrix.multiply([movePup2, Matrix.multiply([this.models.slide3[0].transformPupil, this.models.slide3[0].pupil_1_vertices[i]])]);
        }
        this.drawConvexPolygon(drawPup2, [255, 0, 0, 255]);
        
        
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
