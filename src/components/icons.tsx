import type { VoidComponent } from "solid-js";

export const XToMenu: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      class={props.class}
    >
      <title>Close Menu</title>
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="2"
      >
        <path d="M5 5L12 12L19 5">
          <animate
            fill="freeze"
            attributeName="d"
            dur="0.3s"
            values="M5 5L12 12L19 5;M5 5L12 5L19 5"
          />
        </path>
        <path d="M12 12H12">
          <animate
            fill="freeze"
            attributeName="d"
            dur="0.3s"
            values="M12 12H12;M5 12H19"
          />
        </path>
        <path d="M5 19L12 12L19 19">
          <animate
            fill="freeze"
            attributeName="d"
            dur="0.3s"
            values="M5 19L12 12L19 19;M5 19L12 19L19 19"
          />
        </path>
      </g>
    </svg>
  );
};

export const MenuToX: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      class={props.class}
    >
      <title>Open Menu</title>
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="2"
      >
        <path d="M5 5L12 5L19 5">
          <animate
            fill="freeze"
            attributeName="d"
            dur="0.3s"
            values="M5 5L12 5L19 5;M5 5L12 12L19 5"
          />
        </path>
        <path d="M5 12H19">
          <animate
            fill="freeze"
            attributeName="d"
            dur="0.3s"
            values="M5 12H19;M12 12H12"
          />
        </path>
        <path d="M5 19L12 19L19 19">
          <animate
            fill="freeze"
            attributeName="d"
            dur="0.3s"
            values="M5 19L12 19L19 19;M5 19L12 12L19 19"
          />
        </path>
      </g>
    </svg>
  );
};

export const ShevronSmallDown: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      class={props.class}
    >
      <title>Open</title>
      <g transform="rotate(-90 12 12)">
        <path
          stroke="currentColor"
          stroke-dasharray="8"
          stroke-dashoffset="0"
          stroke-linecap="round"
          stroke-width="2"
          d="M9 12L14 7M9 12L14 17"
          fill="currentColor"
        ></path>
      </g>
    </svg>
  );
};

export const CaretCircleRight: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class={props.class}
    >
      <title>Open</title>
      <path
        fill="currentColor"
        d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m29.66-93.66a8 8 0 0 1 0 11.32l-40 40a8 8 0 0 1-11.32-11.32L140.69 128l-34.35-34.34a8 8 0 0 1 11.32-11.32Z"
      />
    </svg>
  );
};

export const Clipboard: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class={props.class}
    >
      <title>Copy code</title>
      <path
        fill="currentColor"
        d="M200 32h-36.26a47.92 47.92 0 0 0-71.48 0H56a16 16 0 0 0-16 16v168a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16m-72 0a32 32 0 0 1 32 32H96a32 32 0 0 1 32-32m72 184H56V48h26.75A47.9 47.9 0 0 0 80 64v8a8 8 0 0 0 8 8h80a8 8 0 0 0 8-8v-8a47.9 47.9 0 0 0-2.75-16H200Z"
      />
    </svg>
  );
};

export const Hashtag: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class={props.class}
    >
      <title>Link</title>
      <path
        fill="currentColor"
        d="M224 90h-51l8.89-48.93a6 6 0 1 0-11.8-2.14L160.81 90H109l8.89-48.93a6 6 0 0 0-11.8-2.14L96.81 90H48a6 6 0 0 0 0 12h46.63l-9.46 52H32a6 6 0 0 0 0 12h51l-8.9 48.93a6 6 0 0 0 4.83 7A5.6 5.6 0 0 0 80 222a6 6 0 0 0 5.89-4.93l9.3-51.07H147l-8.89 48.93a6 6 0 0 0 4.83 7a5.6 5.6 0 0 0 1.08.1a6 6 0 0 0 5.89-4.93l9.28-51.1H208a6 6 0 0 0 0-12h-46.63l9.46-52H224a6 6 0 0 0 0-12m-74.83 64h-51.8l9.46-52h51.8Z"
      />
    </svg>
  );
};

export const Tag: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class={props.class}
    >
      <title>Property</title>
      <path
        fill="currentColor"
        d="M246.66 123.56L201 55.13A15.94 15.94 0 0 0 187.72 48H40a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h147.72a16 16 0 0 0 13.28-7.12l45.63-68.44a8 8 0 0 0 .03-8.88M187.72 192H40V64h147.72l42.66 64Z"
      />
    </svg>
  );
};

export const Subtitles: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class={props.class}
    >
      <title>Table of contents</title>
      <path
        fill="currentColor"
        d="M224 48H32a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16m0 144H32V64h192zM48 136a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16H56a8 8 0 0 1-8-8m160 0a8 8 0 0 1-8 8h-96a8 8 0 0 1 0-16h96a8 8 0 0 1 8 8m-48 32a8 8 0 0 1-8 8H56a8 8 0 0 1 0-16h96a8 8 0 0 1 8 8m48 0a8 8 0 0 1-8 8h-16a8 8 0 0 1 0-16h16a8 8 0 0 1 8 8"
      />
    </svg>
  );
};

export const Ruler: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class={props.class}
    >
      <title>Prop</title>
      <path
        fill="currentColor"
        d="m235.32 73.37l-52.69-52.68a16 16 0 0 0-22.63 0L20.68 160a16 16 0 0 0 0 22.63l52.69 52.68a16 16 0 0 0 22.63 0L235.32 96a16 16 0 0 0 0-22.63M84.68 224L32 171.31l32-32l26.34 26.35a8 8 0 0 0 11.32-11.32L75.31 128L96 107.31l26.34 26.35a8 8 0 0 0 11.32-11.32L107.31 96L128 75.31l26.34 26.35a8 8 0 0 0 11.32-11.32L139.31 64l32-32L224 84.69Z"
      />
    </svg>
  );
};

export const RoundBrackets: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class={props.class}
    >
      <title>Function</title>
      <path
        fill="currentColor"
        d="M40 128c0 58.29 34.67 80.25 36.15 81.16a8 8 0 0 1-8.27 13.7C66.09 221.78 24 195.75 24 128s42.09-93.78 43.88-94.86a8 8 0 0 1 8.26 13.7C74.54 47.83 40 69.82 40 128m148.12-94.86a8 8 0 0 0-8.27 13.7C181.33 47.75 216 69.71 216 128s-34.67 80.25-36.12 81.14a8 8 0 0 0 8.24 13.72C189.91 221.78 232 195.75 232 128s-42.09-93.78-43.88-94.86"
      />
    </svg>
  );
};

export const PowerCord: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class={props.class}
    >
      <title>Signal</title>
      <path
        fill="currentColor"
        d="M149.66 138.34a8 8 0 0 0-11.32 0L120 156.69L99.31 136l18.35-18.34a8 8 0 0 0-11.32-11.32L88 124.69l-18.34-18.35a8 8 0 0 0-11.32 11.32l6.35 6.34l-23.32 23.31a32 32 0 0 0 0 45.26l5.38 5.37l-28.41 28.4a8 8 0 0 0 11.32 11.32l28.4-28.41l5.37 5.38a32 32 0 0 0 45.26 0L132 191.31l6.34 6.35a8 8 0 0 0 11.32-11.32L131.31 168l18.35-18.34a8 8 0 0 0 0-11.32m-52.29 65a16 16 0 0 1-22.62 0l-22.06-22.09a16 16 0 0 1 0-22.62L76 135.31L120.69 180Zm140.29-185a8 8 0 0 0-11.32 0l-28.4 28.41l-5.37-5.38a32.05 32.05 0 0 0-45.26 0L124 64.69l-6.34-6.35a8 8 0 0 0-11.32 11.32l80 80a8 8 0 0 0 11.32-11.32l-6.35-6.34l23.32-23.31a32 32 0 0 0 0-45.26l-5.38-5.37l28.41-28.4a8 8 0 0 0 0-11.32m-34.35 79L180 120.69L135.31 76l23.32-23.31a16 16 0 0 1 22.62 0l22.06 22a16 16 0 0 1 0 22.68Z"
      />
    </svg>
  );
};

export const FourDiamonds: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class={props.class}
    >
      <title>Variant</title>
      <path
        fill="currentColor"
        d="M122.34 109.66a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0 0-11.32l-40-40a8 8 0 0 0-11.32 0l-40 40a8 8 0 0 0 0 11.32ZM128 35.31L156.69 64L128 92.69L99.31 64Zm5.66 111a8 8 0 0 0-11.32 0l-40 40a8 8 0 0 0 0 11.32l40 40a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0 0-11.32ZM128 220.69L99.31 192L128 163.31L156.69 192Zm109.66-98.35l-40-40a8 8 0 0 0-11.32 0l-40 40a8 8 0 0 0 0 11.32l40 40a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0 0-11.32M192 156.69L163.31 128L192 99.31L220.69 128Zm-82.34-34.35l-40-40a8 8 0 0 0-11.32 0l-40 40a8 8 0 0 0 0 11.32l40 40a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0 0-11.32M64 156.69L35.31 128L64 99.31L92.69 128Z"
      />
    </svg>
  );
};

export const Flag: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class={props.class}
    >
      <title>Flags</title>
      <path
        fill="currentColor"
        d="M42.76 50A8 8 0 0 0 40 56v168a8 8 0 0 0 16 0v-44.23c26.79-21.16 49.87-9.75 76.45 3.41c16.4 8.11 34.06 16.85 53 16.85c13.93 0 28.54-4.75 43.82-18a8 8 0 0 0 2.76-6V56a8 8 0 0 0-13.27-6c-28 24.23-51.72 12.49-79.21-1.12C111.07 34.76 78.78 18.79 42.76 50M216 172.25c-26.79 21.16-49.87 9.74-76.45-3.41c-25-12.35-52.81-26.13-83.55-8.4V59.79c26.79-21.16 49.87-9.75 76.45 3.4c25 12.35 52.82 26.13 83.55 8.4Z"
      />
    </svg>
  );
};

export const ReturnKey: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class={props.class}
    >
      <title>Return</title>
      <path
        fill="currentColor"
        d="M184 104v32a8 8 0 0 1-8 8H99.31l10.35 10.34a8 8 0 0 1-11.32 11.32l-24-24a8 8 0 0 1 0-11.32l24-24a8 8 0 0 1 11.32 11.32L99.31 128H168v-24a8 8 0 0 1 16 0m48-48v144a16 16 0 0 1-16 16H40a16 16 0 0 1-16-16V56a16 16 0 0 1 16-16h176a16 16 0 0 1 16 16m-16 144V56H40v144z"
      />
    </svg>
  );
};

export const ArrowRightElbow: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class={props.class}
    >
      <title>Return</title>
      <path
        fill="currentColor"
        d="m221.66 181.66l-48 48a8 8 0 0 1-11.32-11.32L196.69 184H72a8 8 0 0 1-8-8V32a8 8 0 0 1 16 0v136h116.69l-34.35-34.34a8 8 0 0 1 11.32-11.32l48 48a8 8 0 0 1 0 11.32"
      />
    </svg>
  );
};

export const ArrowLeftSimple: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class={props.class}
    >
      <title>Return</title>
      <path
        fill="currentColor"
        d="M224 128a8 8 0 0 1-8 8H59.31l58.35 58.34a8 8 0 0 1-11.32 11.32l-72-72a8 8 0 0 1 0-11.32l72-72a8 8 0 0 1 11.32 11.32L59.31 120H216a8 8 0 0 1 8 8"
      />
    </svg>
  );
};

export const Article: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class={props.class}
    >
      <title>Types</title>
      <path
        fill="currentColor"
        d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m0 160H40V56h176zM184 96a8 8 0 0 1-8 8H80a8 8 0 0 1 0-16h96a8 8 0 0 1 8 8m0 32a8 8 0 0 1-8 8H80a8 8 0 0 1 0-16h96a8 8 0 0 1 8 8m0 32a8 8 0 0 1-8 8H80a8 8 0 0 1 0-16h96a8 8 0 0 1 8 8"
      />
    </svg>
  );
};

export const LoadingSpinner: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      class={props.class}
    >
      <title>Loading</title>
      <path
        fill="currentColor"
        d="M2,12A11.2,11.2,0,0,1,13,1.05C12.67,1,12.34,1,12,1a11,11,0,0,0,0,22c.34,0,.67,0,1-.05C6,23,2,17.74,2,12Z"
      >
        <animateTransform
          attributeName="transform"
          dur="1.8s"
          repeatCount="indefinite"
          type="rotate"
          values="0 12 12;360 12 12"
        />
      </path>
    </svg>
  );
};

export const LinkSimple: VoidComponent<{
  class?: string;
}> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      class={props.class}
    >
      <title>Link</title>
      <path
        fill="currentColor"
        d="M165.66 90.34a8 8 0 0 1 0 11.32l-64 64a8 8 0 0 1-11.32-11.32l64-64a8 8 0 0 1 11.32 0M215.6 40.4a56 56 0 0 0-79.2 0l-30.06 30.05a8 8 0 0 0 11.32 11.32l30.06-30a40 40 0 0 1 56.57 56.56l-30.07 30.06a8 8 0 0 0 11.31 11.32l30.07-30.11a56 56 0 0 0 0-79.2m-77.26 133.82l-30.06 30.06a40 40 0 1 1-56.56-56.57l30.05-30.05a8 8 0 0 0-11.32-11.32L40.4 136.4a56 56 0 0 0 79.2 79.2l30.06-30.07a8 8 0 0 0-11.32-11.31"
      />
    </svg>
  );
};
