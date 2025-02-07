type Props = {
  header: string;
  stats: number;
  percent: string;
  description: string;
};

export default function ColumnCard({
  header,
  stats,
  percent,
  description,
}: Props) {
  return (
    <div className="flex flex-col justify-between p-4 w-80 bg-white shadow-xl rounded-md">
      <div className="flex flex-col text-right">
        <span>{header}</span>
        <h2>{stats}</h2>
      </div>
      <p>
        <span>{percent}</span>
        {description}
      </p>
    </div>
  );
}
