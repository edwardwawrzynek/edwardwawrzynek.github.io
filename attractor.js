let width = 0;
let height = 0;
let ctx = 0;

window.onload = init;
window.onresize = init;
let drawId = -1;

// plotting bounds
const bounds = [[-30, 30], [-30, 30], [0, 60]];

// projection matrix
let viewVert = 4;
let viewHoriz = -0.8;
let projection = calc_projection_matrix(viewVert, viewHoriz);

// calculate projection matrix (a about vertical, b about horizontal)
function calc_projection_matrix(a, b) {
    return [[Math.cos(b), 0, -Math.sin(b)],
            [Math.sin(a)*Math.sin(b), -Math.cos(a), Math.sin(a)*Math.cos(b)]];
}

// renormalize point from bounds to [-1, 1]
function norm_pt(pt) {
    return [2.0*(pt[0]-bounds[0][0]) / (bounds[0][1] - bounds[0][0]) - 1,
            2.0*(pt[1]-bounds[1][0]) / (bounds[1][1] - bounds[1][0]) - 1,
            2.0*(pt[2]-bounds[2][0]) / (bounds[2][1] - bounds[2][0]) - 1];
}

// project point to screen coordinates
function project_pt(pt) {
    const p = norm_pt(pt);
    const A = projection;

    // center plot at center of canvas, 
    const proj_coord = [
        p[0] * A[0][0] + p[1] * A[0][1] + p[2] * A[0][2],
        p[0] * A[1][0] + p[1] * A[1][1] + p[2] * A[1][2]
    ];
    

    const x = proj_coord[0] * (width/2.2) + width/2;
    const y = proj_coord[1] * (height/2.2) + height/2;

    return [x, y];
}

// plot point
function plot_pt(pt) {
    const pos = project_pt(pt);

    ctx.beginPath();
    ctx.arc(pos[0], pos[1], 1, 0, 2*Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
}

// plot line between p0 and p1
function plot_line(p0, p1) {
    p0 = project_pt(p0);
    p1 = project_pt(p1);

    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.lineTo(p1[0], p1[1]);
    ctx.stroke();
}

// add two vectors x0 and x1
function add_vec(x0, x1) {
    return [x0[0] + x1[0], x0[1] + x1[1], x0[2] + x1[2]];
}

// scalar multiply vector
function mul_vec(x, k) {
    return [k*x[0], k*x[1], k*x[2]];
}

// calculate the p-infinity norm of the vector
function pinf(x) {
    return Math.max(Math.abs(x[0]), Math.max(Math.abs(x[1], Math.abs(x[2]))));
}

// perform a step of 4th order Runge-Kutta on a system of the form
// dx/dt = f(x)
// h is step size, x0 is point, f is derivative
function rk4(f, x, h) {
    const v1 = f(x);
    const v2 = f(add_vec(x, mul_vec(v1, h/2)));
    const v3 = f(add_vec(x, mul_vec(v2, h/2)));
    const v4 = f(add_vec(x, mul_vec(v3, h)));

    return add_vec(x, mul_vec(add_vec(add_vec(add_vec(v1, mul_vec(v2, 2)), mul_vec(v3, 2)), v4), h/6));
}

// perform a step of adaptive rk4 to desired tolerance tol
function adaptive_rk4(f, x0, h0, tol, hmax) {
    // calculate error estimate
    const x1 = rk4(f, x0, h0);
    const x2 = rk4(f, rk4(f, x0, h0/2), h0/2);
    const delta1 = pinf(add_vec(x1, mul_vec(x2, -1)));

    h = Math.min(0.9 * h0 * Math.pow(tol / delta1, 0.2), hmax);

    const x_new = rk4(f, x0, h);
    return [x_new, h];
}

// solve the system dx/dt = f(x) with adaptive RK4 to specified time and tolerance
function solve_rk4(f, x0, h, tstart, tend, tol, hmax) {
    pts = [];
    times = [];
    t = tstart;
    let x1 = x0;
    while(t < tend) {
        [x1, h] = adaptive_rk4(f, x1, h, tol, hmax);
        t += h;
        pts.push(x1);
        times.push(t);
    }

    return [pts, times];
}

const sigma = 10;
const rho = 28;
const beta = 8.0/3.0;

// the lorenz system
function lorenz(x) {
    return [
        sigma * (x[1] - x[0]),
        x[0]*(rho - x[2]) - x[1],
        x[0]*x[1] - beta * x[2]
    ];
}

function draw_clear() {
    ctx.clearRect(0, 0, width, height);

    //viewVert += 0.005;
    viewHoriz -= 0.001;
    projection = calc_projection_matrix(viewVert, viewHoriz);
}

function draw_axes() {
    ctx.strokeStyle = "red";
    plot_line([0, 0, 0], [2, 0, 0]);
    ctx.strokeStyle = "green";
    plot_line([0, 0, 0], [0, 2, 0]);
    ctx.strokeStyle = "blue";
    plot_line([0, 0, 0], [0, 0, 2]);
}


let sys_pos = [[11.3, 0.68, 39.66]];
let sys_times = [0];
const sys_tol = 0.001;
const sys_h = 0.001;
const sys_max_h = 0.01;
const sys_tstep = 0.04;

function draw_system() {
    const last_pos = sys_pos[sys_pos.length - 1];
    const last_time = sys_times[sys_times.length - 1];

    const [x, t] = solve_rk4(lorenz, last_pos, sys_h, last_time, last_time + sys_tstep, sys_tol, sys_max_h);

    sys_pos = sys_pos.concat(x).slice(-1500);
    sys_times = sys_times.concat(t).slice(-1500);

    for(let i = 0; i < sys_pos.length-1; i++) {
        plot_line(sys_pos[i], sys_pos[i+1]);
    }
}

function draw() {
    draw_clear();
    // draw_axes();
    
    draw_system();
}

function init() {
    let content = document.getElementById("content");
    let canvas = document.getElementById("attractor_canvas");
    canvas.width = 0;
    canvas.height = 0;

    if(drawId != -1) {
        window.clearInterval(drawId);
    }
    content.classList.remove("contentNoMargin");

    // make sure we have at least 200 free pixels
    width = window.innerWidth - content.offsetWidth - 130;
    height = window.innerHeight;
    if(width < 200) {
        return;
    }

    // size canvas
    content.classList.add("contentNoMargin");
    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext("2d");
    drawId = window.setInterval(draw, 40);
}