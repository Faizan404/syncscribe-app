import { useEffect, useState } from "react";

import { useRoom } from "@liveblocks/react/suspense";
import { useSelf } from "@liveblocks/react";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteEditor } from "@blocknote/core";

import { Sun } from "lucide-react";
import { Moon } from "lucide-react";

import * as Y from "yjs";
import stringToColor from "../libs/stringToColor";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import useOwner from "../libs/useOwner";
import TranslateDocument from "./TranslateDocument";
import ChatToDocument from "./ChatToDocument";

type EditorProps = {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider;
  theme: boolean;
};

function BlockNote({ doc, provider, theme }: EditorProps) {
  const self = useSelf((user) => user.info);

  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: self?.name!,
        color: stringToColor(self?.email),
      },
    },
  });

  return (
    <div className="relative max-w-6xl mx-auto my-8">
      <BlockNoteView editor={editor} theme={theme ? "dark" : "light"} />
    </div>
  );
}

function Editor() {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [theme, setTheme] = useState<boolean>(false);
  const isOwner = useOwner();

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yjsProvider = new LiveblocksYjsProvider(room, yDoc);

    setDoc(yDoc);
    setProvider(yjsProvider);

    return () => {
      yDoc?.destroy();
      yjsProvider?.disconnect();
    };
  }, [room]);

  if (!doc || !provider) return null;

  const style = `btn hover:text-white ${
    !theme
      ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
      : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
  }`;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-end">
        <TranslateDocument doc={doc} />
        <ChatToDocument doc={doc} />
        <button className={style} onClick={() => setTheme(!theme)}>
          {theme ? <Sun /> : <Moon />}
        </button>
      </div>
      <BlockNote doc={doc} provider={provider} theme={theme} />
    </div>
  );
}
export default Editor;
