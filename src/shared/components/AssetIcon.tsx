interface Props {
  assetId: string;
  size?: number;
  className?: string;
}

export default function AssetIcon({ assetId, size = 16, className = '' }: Props) {
  const iconPath = `/crypto-icons/${assetId.toLowerCase()}.svg`;

  return (
    <img
      src={iconPath}
      alt={`${assetId} icon`}
      className={className}
      width={size}
      height={size}
      onError={(e) => {
        e.currentTarget.src = `/question.svg`;
      }}
    />
  );
}