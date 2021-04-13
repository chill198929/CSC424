import React from "react";
import Board from "../board/board";
import Chat from "../chat/chat";
import "./team.css";

export default function Teams() {
  const resize = (e) => {
    const handler = document.querySelector(".handler");
    const wrapper = handler.closest(".main-content");
    const boxA = wrapper.querySelector(".box");

    // Get offset
    const containerOffsetLeft = wrapper.offsetLeft;

    // Get x-coord of pointer, container relative
    const pointerRelativeXpos = e.clientX - containerOffsetLeft;

    // Arbitrary min width, prevents collapsing to 0
    const boxAMinWidth = 60;

    // Resize box A
    // * 8px is the left/right spacing between .handler and its inner pseudo-element
    // * Set flex-grow to 0 to prevent it from growing
    boxA.style.width = Math.max(boxAMinWidth, pointerRelativeXpos - 8) + "px";
    boxA.style.flexGrow = 0;
  };

  return (
    <>
      <div class="box">
        <Board />
      </div>
      <div
        class="handler"
        draggable="true"
        onDrag={resize}
        onDragEnd={resize}
      ></div>
      <div class="box">
        <Chat />
      </div>
    </>
  );
}
