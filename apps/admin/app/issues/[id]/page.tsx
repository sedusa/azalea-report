import { IssueEditor } from './IssueEditor';

export default function IssueEditorPage({ params }: { params: { id: string } }) {
  return <IssueEditor issueId={params.id} />;
}
