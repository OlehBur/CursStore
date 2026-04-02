import { useState, type ReactNode } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import './RangeFilter.css';

type RangeFilterProps = {
  title: ReactNode; // allow string or JSX
  field: string;
  min: number;
  max: number;
  unit?: string;
  filters: any;
  setFilters: React.Dispatch<any>; // or better typed state updater
};

//double range slider component
const RangeFilter = ({ title, field, min, max, unit, filters, setFilters }: RangeFilterProps) => {
    const [displayValues, setDisplayValues] = useState([//hot prev val
        Number(filters[field][0]) || Number(min),
        Number(filters[field][1]) || Number(max)
    ]);

    if (min === undefined || max === undefined)
        return null;

    return <div className="filter-item">
        <label className="filter-label">
            <span>{title}</span>
            <span className="filter-values">
                {/* {unit === '$' ? `$${filters[field][0]}` : filters[field][0]} — {unit === '$' ? `$${filters[field][1]}` : filters[field][1]} {unit !== '$' && unit} */}

                {/* {displayValues[0]} — {displayValues[1]} */}

                {/* {unit === '$' ? `$${displayValues[0]}` : displayValues[0]} —{unit === '$' ? `$${displayValues[1]}` : displayValues[1]} {unit !== '$' && unit} */}

                {`${displayValues[0]} — ${displayValues[1]} ${unit}`}
            </span>
        </label>
        <div className="slider-wrapper">
            <Slider
                range
                min={Number(min)}
                max={Number(max)}
                //  defaultValue ins value, so tha React doesnt cont mili change
                defaultValue={[Number(filters[field][0]), Number(filters[field][1])]}
                // value={displayValues}
                onChange={(val: any) => {
                    setDisplayValues(val);
                }}
                onChangeComplete/*onAfterChange */={(val: any) => {  // onAfterChange exc onl aft releas
                    setFilters({ ...filters, [field]: val, page: 1 });
                }}

                styles={{
                    handle: {
                        height: 24,
                        width: 24,
                        marginTop: -9,
                        backgroundColor: '#fff',
                        border: '2px solid #ff3e3e',
                        opacity: 1,
                        cursor: 'grab',
                        boxShadow: 'none'
                    },
                    track: {
                        backgroundColor: '#ff3e3e',
                        height: 6
                    },
                    rail: {
                        backgroundColor: '#555',
                        height: 6
                    }
                }}
            // handleStyle={[
            //     { height: 24, width: 24, marginTop: -9, backgroundColor: '#fff', border: '2px solid #ff3e3e', opacity: 1, cursor: 'grab' },
            //     { height: 24, width: 24, marginTop: -9, backgroundColor: '#fff', border: '2px solid #ff3e3e', opacity: 1, cursor: 'grab' }
            // ]}
            // range // enab double handle
            // min={Number(min)}//NUmnber for guarant type
            // max={Number(max)}
            // // value={[//if state = 0 & min >0  slider crashes
            // //     Number(filters[field][0]) || Number(min),
            // //     Number(filters[field][1]) || Number(max)
            // // ]}
            // value={[Number(filters[field][0]), Number(filters[field][1])]}
            // // value={filters[field]} //  [min, max]
            // // step={1}
            // onChange={(val: any) => setFilters({ ...filters, [field]: val, page: 1 })}

            // allowCross={false} //  disable handles crossing
            // disabled={false}

            // styles={{
            //     track: { backgroundColor: '#ff3e3e', height: 6 },
            //     handle: {
            //         borderColor: '#ff3e3e',
            //         backgroundColor: '#fff',
            //         opacity: 1,
            //         boxShadow: 'none',
            //         height: 18,
            //         width: 18,
            //         marginTop: -6,
            //         cursor: 'grab'
            //     },
            //     rail: { backgroundColor: '#555', height: 6 }
            // }}
            />
        </div>
    </div>
};

export default RangeFilter;