import LangScope from "@/components/LangScope";
import BriefWizard from "./_components/BriefWizard";
import { DICT } from "./_components/dict";

export const metadata = {
  title: "Brief",
  description: "Help us understand your business, goals, and vision so we can build something remarkable together.",
};

export default function Brief() {
  return (
    <LangScope dict={DICT}>
      <BriefWizard />
    </LangScope>
  );
}
