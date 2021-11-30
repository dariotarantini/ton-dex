import { useEffect, useState } from 'react';
import IColumnTemplate from './IColumnTemplate';

import { ReactComponent as ArrowFull } from '../../assets/icons/arrow_full.svg';

import './Table.css';

interface IColumn {
  key: number
  rendered: string | JSX.Element
}

type props = {
  cols: IColumnTemplate[],
  rows: IColumn[][],
  defaultSorted: number
  pageSize?: number
}

type Sort = {
  col: number
  reverse: boolean
}

function renderRow(template: IColumnTemplate[], row: IColumn[], i?: number): JSX.Element {
  const renderedCols = [];

  for (let i in row) {
    renderedCols.push(
      <div
        key={i}
        style={{ width: `${template[i].width * 100}%` }}
        className={
          'table__col' +
          (template[i].alignRight ? ' table__col--right' : '') + 
          (template[i].showOnMobile ? ' table__col--mobile' : '') +
          (typeof row[i].rendered !== 'string' ? ' table__col--el' : '')
        }
      >
        {row[i].rendered}
      </div>
    );
  }

  return (
    <div className="table__row" key={i}>{renderedCols}</div>
  );
}

export default function Table({ cols, rows, pageSize, defaultSorted }: props) {
  const [sortingCol, setSortingCol] = useState<Sort>({ col: defaultSorted ?? 0, reverse: false });
  const [currentPage, setPage] = useState<number>(0);

  const sortedRows = rows.sort((a, b) => {
    const f = b[sortingCol.col].key;
    const s = a[sortingCol.col].key;
    return sortingCol.reverse ? s - f : f - s;
  });

  const pages = pageSize ? Math.ceil(rows.length / pageSize) : 1;
  const startSlice = currentPage * (pageSize ?? 1);
  const endSlice = currentPage * (pageSize ?? 1) + (pageSize ?? 1);
  const pageRows = pageSize ? sortedRows.slice(startSlice, endSlice) : rows;
  const renderedRows = pageRows.map((r, i) => renderRow(cols, r, i));
  
  const prev = () => setPage(currentPage > 0 ? currentPage - 1 : 0);
  const next = () => setPage(currentPage < pages - 1 ? currentPage + 1 : pages - 1);

  useEffect(() => setPage(0), [ rows ]);

  function renderColTitle(template: IColumnTemplate, i: number): IColumn {
    if (typeof template.title === 'string') {
      return {
        key: -1,
        rendered: (
          <div
            className={
              'table__col table__col--title' + 
              (sortingCol.col === i ? ' table__col--sorted' : '') +
              (sortingCol.reverse ? ' table__col--reverse' : '')
            }
            onClick={() => setSortingCol({
              col: i,
              reverse: sortingCol.col === i ? !sortingCol.reverse : false
            })}
          >{template.title}</div>
        )
      };
    } else {
      return {
        key: -1,
        rendered: template.title
      };
    }
  }

  function renderPages(): JSX.Element {
    return (
      <div className="table__pages">
        <div
          className={
            'table_page__arrow' +
            (currentPage === 0 ? ' table_page__arrow--grey' : '')
          }
          onClick={prev}
        >
          <ArrowFull />
        </div>
        <span className="table__page">Page {currentPage + 1} of {pages}</span>
        <div
          className={
            `table_page__arrow table_page__arrow--next` +
            (currentPage === pages - 1 ? ' table_page__arrow--grey' : '')
          }
          onClick={next}
        >
          <ArrowFull />
        </div>
      </div>
    );
  }

  return (
    <div className="table">
      {renderRow(cols, cols.map((c, i) => renderColTitle(c, i), -1))}
      {renderedRows}
      {
        pages > 1
          ? renderPages()
          : ''
      }
    </div>
  );
}