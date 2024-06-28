import React, { useState } from 'react';
import WidgetCounter from '../../components/widget/WidgetCounter/front/widgetCounter';

const PagePoc = () => {
    const [counters, setCounters] = useState<number[]>([]);

    const addCounter = () => {
        setCounters(prevCounters => [...prevCounters, prevCounters.length + 1]);
    };

    return (
        <div>
            <button onClick={addCounter}>Add Counter</button>
            {
                counters.map(counter => (
                    <WidgetCounter key={counter} />
                ))
            }
        </div>
    );
};

export default PagePoc;