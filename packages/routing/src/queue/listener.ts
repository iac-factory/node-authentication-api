// import Event from "events";
// import Utility from "util";
//
// const Emitter: NodeJS.EventEmitter & (new () => NodeJS.EventEmitter) & ((this: Constructor) => Constructor) = function (this: Constructor): Constructor {
//     Event.call(this);
//
//     // if ( !(this) || !(this instanceof Function) ) {
//     //     Event.call(this);
//     // }
//
//     // use nextTick to emit the event once a handler is assigned
//     process.nextTick(() => {
//         (this as NodeJS.EventEmitter).emit("event");
//     });
//
//     return this
// }
//
// type Constructor = NodeJS.EventEmitter & {
//     new (): NodeJS.EventEmitter;
// };
//
// Reflect.setPrototypeOf(Emitter, Event);
//
// const myEmitter = new Emitter();
// myEmitter.on("event", () => {
//     console.log("an event occurred!");
// });
