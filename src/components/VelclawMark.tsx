interface Props {
  size?: number;
}

export default function VelclawMark({ size = 24 }: Props) {
  return (
    <div
      className="rounded-md bg-neutral-950 ring-1 ring-neutral-800 flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 48 48" width={size * 0.58} height={size * 0.58} fill="none">
        <path d="M7 6 L17 24 L11 44" stroke="#ef4444" strokeWidth="6" strokeLinecap="square" />
        <path d="M20 4 L30 24 L22 44" stroke="#dc2626" strokeWidth="6" strokeLinecap="square" />
        <path d="M33 6 L43 22 L35 40" stroke="#b91c1c" strokeWidth="6" strokeLinecap="square" />
      </svg>
    </div>
  );
}
