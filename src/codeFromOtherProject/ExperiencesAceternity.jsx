import { EXPERIENCES_LINKEDIN } from "./data";
import { Timeline } from './Timeline';

const ExperiencesAceternity = () => {
  return (
    <div className="container mx-auto max-w-7xl">
      <Timeline data={EXPERIENCES_LINKEDIN} />
    </div>
  );
};

export default ExperiencesAceternity;
