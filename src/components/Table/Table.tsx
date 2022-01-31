import { useCallback, useEffect, useState } from 'react';

import IColumnTemplate from './IColumnTemplate';

import { ReactComponent as ArrowFull } from '../../assets/icons/arrow_full.svg';
import { ReactComponent as Arrow } from '../../assets/icons/arrow.svg';

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

const renderRow = (template: IColumnTemplate[], row: IColumn[], i?: number) => {
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

  const [currentPage, setPage] = useState(0);
  const [pagesCount, setPagesCount] = useState(0)
  const [pageRows, setPageRows] = useState<IColumn[][]>();

  const sortRows = useCallback((rows: IColumn[][]) => rows.sort((a, b) => {
    const f = b[sortingCol.col].key;
    const s = a[sortingCol.col].key;
    return sortingCol.reverse ? s - f : f - s;
  }), [sortingCol]);

  const prev = useCallback(() => {
    if (!pagesCount) return;
    setPage(currentPage > 0 ? currentPage - 1 : 0);
  }, [pagesCount, currentPage]);

  const next = useCallback(() => {
    if (!pagesCount) return;
    setPage(currentPage < pagesCount - 1 ? currentPage + 1 : pagesCount - 1);
  }, [currentPage, pagesCount]);

  useEffect(() => {
    setPagesCount(pageSize ? Math.ceil(rows.length / pageSize) : 1);
  }, [pageSize, rows]);

  useEffect(() => {
    const startSlice = currentPage * (pageSize ?? 1);
    const endSlice = currentPage * (pageSize ?? 1) + (pageSize ?? 1);
    setPageRows(pageSize ? sortRows(rows).slice(startSlice, endSlice) : rows);
  }, [currentPage, pageSize, rows, sortRows]);

  useEffect(() => setPage(0), [ rows ]);

  const renderRows = () => pageRows?.map((r, i) => renderRow(cols, r, i));

  const renderColTitle = (template: IColumnTemplate, i: number) => {
    if (typeof template.title !== 'string') {
      return {
        key: -1,
        rendered: template.title
      };
    }

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
        >
          {!template.alignRight ? <Arrow /> : null}
          <span>{template.title}</span>
          {template.alignRight ? <Arrow /> : null}
        </div>
      )
    };
  }

  const renderPages = () => (
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
      <span className="table__page">Page {currentPage + 1} of {pagesCount}</span>
      <div
        className={
          `table_page__arrow table_page__arrow--next` +
          (currentPage === pagesCount - 1 ? ' table_page__arrow--grey' : '')
        }
        onClick={next}
      >
        <ArrowFull />
      </div>
    </div>
  );

  return (
    <div className="table">
      {renderRow(cols, cols.map((c, i) => renderColTitle(c, i), -1))}
      {renderRows()}
      {pagesCount > 1 ? renderPages() : null}
    </div>
  );
}