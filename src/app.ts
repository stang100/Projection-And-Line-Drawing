import {Drawing, Vector, Point} from "./common"
import {init_tests, draw_tests} from "./projection_test"
var ctm: number[][]
var num: number[]
num = [];
var temp_mat: number[][]
var temp_mat1: number[][]
var vertex_list: Point[]
var matrixViewPort: number[][]

// A class for our application state and functionality
class MyDrawing extends Drawing {
    constructor (div: HTMLElement) {
        super(div)
 
        init_tests(this)
    }

    drawScene() {
        draw_tests(this)
    }

    // Matrix and Drawing Library implemented as part of this object

    // Begin by using the matrix transformation routines from part A of this project.
    // Make your current transformation matrix a property of this object.
    // You should modify the new routines listed below to complete the assignment.
    // Feel free to define any additional classes, class variables and helper methods
    // that you need.

    beginShape() {
        vertex_list = []
    }

    endShape() {
        matrixViewPort = [[this.canv.width/2, 0, 0, (this.canv.width - 1) / 2],
                        [0, this.canv.height / 2, 0, (this.canv.height - 1) / 2],
                        [0, 0, 1, 0],
                        [0, 0, 0, 1]]
        if (vertex_list.length % 2 == 0) {
            var tempNum: number[][]
            var tempNum1: number[][]
            var tempM: number[][]
            var tempM1: number[][]
            for (var i = 0; i < vertex_list.length - 1; i += 2) {
                tempNum = [[vertex_list[i].x], [vertex_list[i].y], [vertex_list[i].z], [1]]
                tempM = this.matrixMultiplication4x4(matrixViewPort, temp_mat1)
                tempM = this.matrixMultiplication4x4(tempM, ctm)
                tempNum = this.matrixMultiplication4x1(tempM, tempNum)

                tempNum1 = [[vertex_list[i + 1].x], [vertex_list[i + 1].y], [vertex_list[i + 1].z], [1]]
                tempM1 = this.matrixMultiplication4x4(matrixViewPort, temp_mat1)
                tempM1 = this.matrixMultiplication4x4(tempM1, ctm)
                tempNum1 = this.matrixMultiplication4x1(tempM1, tempNum1)

                let ptNum = {x: tempNum[0][0] / tempNum[3][0], y: tempNum[1][0] / tempNum[3][0], z: tempNum[2][0] / tempNum[3][0]}

                let ptNum1 = {x: tempNum1[0][0] / tempNum1[3][0], y: tempNum1[1][0] / tempNum1[3][0], z: tempNum1[2][0] / tempNum1[3][0]}

                this.line(ptNum, ptNum1)
            }
        } else {
            var tempNum: number[][]
            var tempNum1: number[][]
            for (var i = 0; i < vertex_list.length - 2; i += 2) {
                tempNum = [[vertex_list[i].x], [vertex_list[i].y], [vertex_list[i].z], [1]]
                tempM = this.matrixMultiplication4x4(matrixViewPort, temp_mat1)
                tempM = this.matrixMultiplication4x4(tempM, ctm)
                tempNum = this.matrixMultiplication4x1(tempM, tempNum)

                tempNum1 = [[vertex_list[i + 1].x], [vertex_list[i + 1].y], [vertex_list[i + 1].z], [1]]
                tempM1 = this.matrixMultiplication4x4(matrixViewPort, temp_mat1)
                tempM1 = this.matrixMultiplication4x4(tempM1, ctm)
                tempNum1 = this.matrixMultiplication4x1(tempM1, tempNum1)

                let ptNum = {x: tempNum[0][0] / tempNum[3][0], y: tempNum[1][0] / tempNum[3][0], z: tempNum[2][0] / tempNum[3][0]}

                let ptNum1 = {x: tempNum1[0][0] / tempNum1[3][0], y: tempNum1[1][0] / tempNum1[3][0], z: tempNum1[2][0] / tempNum1[3][0]}

                this.line(ptNum, ptNum1)
            }
        }
    }

    vertex(x: number, y: number, z: number) {
        let pt = {x: x, y: y, z: z}
        vertex_list.push(pt)
    }

    perspective(fov: number, near: number, far: number) {
        var aspectRatio = this.canv.width / this.canv.height
        var k = Math.tan((fov / 2) * Math.PI / 180) * near * -1

        var t = k
        var b = -t
        var r = t * aspectRatio
        var l = -t * aspectRatio


        temp_mat1 = [[2 * near / (r - l), 0, (l + r) / (l - r), 0], 
                    [0, 2 * near / (t - b), (b + t) / (b - t), 0], 
                    [0, 0, (far + near) / (near - far), 2 * far * near / (far - near)], 
                    [0, 0, 1, 0]];
        
    }

    ortho(left: number, right: number, top: number, bottom: number, 
        near: number, far: number ) {
        temp_mat1 = [[2/(right - left), 0, 0, -1 * (right + left) / (right - left)], 
                    [0, 2 / (top - bottom), 0, -1 * (top + bottom) / (top - bottom)], 
                    [0, 0, 2 / (near - far), -1 * (near + far) / (near - far)], 
                    [0, 0, 0, 1]];
        
	}

    initMatrix() // was init()
    {
        ctm = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    }
    
    // mutiply the current matrix by the translation
    translate(x: number, y: number, z: number)
    {
        temp_mat = [[1, 0, 0, x], [0, 1, 0, y], [0, 0, 1, z], [0, 0, 0, 1]];
        ctm = this.matrixMultiplication4x4(ctm, temp_mat)
    }
    
    // mutiply the current matrix by the scale
    scale(x: number, y: number, z: number)
    {
        temp_mat = [[x, 0, 0, 0], [0, y, 0, 0], [0, 0, z, 0], [0, 0, 0, 1]];
        ctm = this.matrixMultiplication4x4(ctm, temp_mat)
    }
    
    // mutiply the current matrix by the rotation
    rotateX(angle: number)
    {
        temp_mat = [[1, 0, 0, 0], [0, Math.cos(angle * Math.PI / 180), Math.sin(-1 * angle * Math.PI / 180), 0], [0, Math.sin(angle * Math.PI / 180), Math.cos(angle * Math.PI / 180), 0], [0, 0, 0, 1]];
        ctm = this.matrixMultiplication4x4(ctm, temp_mat)
    }
    
    // mutiply the current matrix by the rotation
    rotateY(angle: number)
    {
        temp_mat = [[Math.cos(angle * Math.PI / 180), 0, Math.sin(angle * Math.PI / 180), 0], [0, 1, 0, 0], [Math.sin(-1 * angle * Math.PI / 180), 0, Math.cos(angle * Math.PI / 180), 0], [0, 0, 0, 1]];
        ctm = this.matrixMultiplication4x4(ctm, temp_mat)
    }
    
    // mutiply the current matrix by the rotation
    rotateZ(angle: number)
    {
        temp_mat = [[Math.cos(angle * Math.PI / 180), Math.sin(-1 * angle * Math.PI / 180), 0, 0], [Math.sin(angle * Math.PI / 180), Math.cos(angle * Math.PI / 180), 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
        ctm = this.matrixMultiplication4x4(ctm, temp_mat)
    }

    printMatrix() // was print
    {
        var lin: String
        lin = ""
        for (var i = 0; i < 4; i++) {
            for (var k = 0; k < 4; k++) {
                lin = "" + lin + ctm[i][k] + ", "
            }
            console.log(lin)
            lin = ""
        }
        console.log("")
    }

    matrixMultiplication4x1(matrix1: number[][], matrix2: number[][]) : number[][] {
        var newNum: number[][]
        newNum = [[0], [0], [0], [0]]
        var sum = 0
        for (var i = 0; i < matrix1.length; i++) {
            for (var j = 0; j < 1; j++) {
                for (var k = 0; k < matrix2.length; k++) {
                    sum += matrix1[i][k] * matrix2[k][j]
                }
                newNum[i][j] = sum
                sum = 0
            }
        }
        return newNum
    }
    matrixMultiplication4x4(matrix1: number[][], matrix2: number[][]) : number[][] {
        var newNum: number[][]
        newNum = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
        var sum = 0
        for (var i = 0; i < matrix1.length; i++) {
            for (var j = 0; j < matrix2[i].length; j++) {
                for (var k = 0; k < matrix2.length; k++) {
                    sum += matrix1[i][k] * matrix2[k][j]
                }
                newNum[i][j] = sum
                sum = 0
            }
        }
        return newNum
    }
}

// a global variable for our state
var myDrawing: MyDrawing

// main function, to keep things together and keep the variables created self contained
function exec() {
    // find our container
    var div = document.getElementById("drawing");

    if (!div) {
        console.warn("Your HTML page needs a DIV with id='drawing'")
        return;
    }

    // create a Drawing object
    myDrawing = new MyDrawing(div);
    myDrawing.render()
}

exec()