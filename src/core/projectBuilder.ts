import { EventsLoop } from './Handler/Events';
import { SaveProcess } from './ProccesSave';

export const build = () => {
    console.log('Building the project...');
    SaveProcess();
    EventsLoop();
};
