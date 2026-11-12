export default function SignalMark({ small = false }: { small?: boolean }) {
  return <span className={`signal-mark${small ? " signal-mark-small" : ""}`} aria-hidden="true">
    <i className="signal-corner tl"/><i className="signal-corner tr"/>
    <i className="signal-corner bl"/><i className="signal-corner br"/>
    <i className="signal-eye left"/><i className="signal-eye right"/>
  </span>;
}
