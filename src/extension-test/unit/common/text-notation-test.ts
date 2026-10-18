import * as expectLib from 'expect';
import * as textNotation from '../common/text-notation';

describe('text-notation test utils', () => {
  describe('textNotationFromDoc', () => {
    it('returns the same input text to textNotationFromDoc', () => {
      const inputText = '(a b|1) (a b|) (a <2(b)<2)';
      const doc = textNotation.docFromTextNotation(inputText);
      expectLib.expect(textNotation.textNotationFromDoc(doc)).toEqual(inputText);
    });
    it('returns the normalized version of the input text to textNotationFromDoc', () => {
      const inputText = '<0e<0 f >1g>1';
      const normalized = '<e< f |1g|1';
      const doc = textNotation.docFromTextNotation(inputText);
      expectLib.expect(textNotation.textNotationFromDoc(doc)).toEqual(normalized);

      const inputText1 = '|3a|3 <1b<1 >2c>2 d•>0e>0 f |4g<5<5';
      const normalized1 = '|3a|3 <1b<1 |2c|2 d•|e| f |4g|5';
      const doc1 = textNotation.docFromTextNotation(inputText1);
      expectLib.expect(textNotation.textNotationFromDoc(doc1)).toEqual(normalized1);
    });
    it('has cursor at end when no trailing newline', () => {
      const inputText = '()|';
      const doc = textNotation.docFromTextNotation(inputText);
      expectLib.expect(textNotation.textNotationFromDoc(doc)).toEqual(inputText);
    });
  });
  describe('docFromTextNotation', () => {
    describe('textAndSelection - single cursors', () => {
      it('creates single cursor position', () => {
        const tn = '(a b|)';
        const text = '(a b)';
        const selection = [4, 4];
        const doc = textNotation.docFromTextNotation(tn);
        expectLib.expect(textNotation.textAndSelection(doc)).toEqual([text, selection]);
      });
      it('creates single cursor position from multiple selections', () => {
        const tn = '(|1a |2b|)';
        const text = '(a b)';
        const selection = [4, 4];
        const doc = textNotation.docFromTextNotation(tn);
        expectLib.expect(textNotation.textAndSelection(doc)).toEqual([text, selection]);
      });
      it('creates single range/selection', () => {
        const tn = '(a |b|)';
        const text = '(a b)';
        const selection = [3, 4];
        const doc = textNotation.docFromTextNotation(tn);
        expectLib.expect(textNotation.textAndSelection(doc)).toEqual([text, selection]);
      });
      it('creates single range/selection from multiple selections', () => {
        const tn = '|1(|1|2a|2 |b|)';
        const text = '(a b)';
        const selection = [3, 4];
        const doc = textNotation.docFromTextNotation(tn);
        expectLib.expect(textNotation.textAndSelection(doc)).toEqual([text, selection]);
      });
      it('creates single directed r->l range/selection', () => {
        const tn = '(a <b<)';
        const text = '(a b)';
        const selection = [4, 3];
        const doc = textNotation.docFromTextNotation(tn);
        expectLib.expect(textNotation.textAndSelection(doc)).toEqual([text, selection]);
      });
      it('creates a single directed r->l range/selection from the primary cursor amongst multiple', () => {
        const tn = '(<1a<1 <b<)';
        const text = '(a b)';
        const selection = [4, 3];
        const doc = textNotation.docFromTextNotation(tn);
        expectLib.expect(textNotation.textAndSelection(doc)).toEqual([text, selection]);
      });
      it('creates a single cursor from the primary cursor amongst a variety of multi-cursor positions and selections', () => {
        const tn = '|3a|3 <1b<1 >2c>2 d•>0e>0 f |4g<5<5';
        const text = 'a b c d•e f g'.replace(/•/g, '\n');
        const selection = [8, 9];
        const doc = textNotation.docFromTextNotation(tn);
        expectLib.expect(textNotation.textAndSelection(doc)).toEqual([text, selection]);
      });
    });
    describe('textAndSelections - multiple cursors', () => {
      it('creates single cursor position', () => {
        const tn = '(a b|)';
        const text = '(a b)';
        const selections = [[4, 4]];
        const doc = textNotation.docFromTextNotation(tn);
        expectLib.expect(textNotation.textAndSelections(doc)).toEqual([text, selections]);
      });
      it('creates multiple cursor positions', () => {
        const tn = '(|1a |2b|)';
        const text = '(a b)';
        const selections = [
          [4, 4],
          [1, 1],
          [3, 3],
        ];
        const doc = textNotation.docFromTextNotation(tn);
        expectLib.expect(textNotation.textAndSelections(doc)).toEqual([text, selections]);
      });
      it('creates single range/selection', () => {
        const tn = '(a |b|)';
        const text = '(a b)';
        const selections = [[3, 4]];
        const doc = textNotation.docFromTextNotation(tn);
        expectLib.expect(textNotation.textAndSelections(doc)).toEqual([text, selections]);
      });
      it('creates multiple ranges/selections', () => {
        const tn = '|1(|1|2a|2 |b|)';
        const text = '(a b)';
        const selections = [
          [3, 4],
          [0, 1],
          [1, 2],
        ];
        const doc = textNotation.docFromTextNotation(tn);
        expectLib.expect(textNotation.textAndSelections(doc)).toEqual([text, selections]);
      });
      it('creates single directed r->l range/selection', () => {
        const tn = '(a <b<)';
        const text = '(a b)';
        const selections = [[4, 3]];
        const doc = textNotation.docFromTextNotation(tn);
        expectLib.expect(textNotation.textAndSelections(doc)).toEqual([text, selections]);
      });
      it('creates a variety directed r->l range/selection', () => {
        const tn = '(<1a<1 <b<)';
        const text = '(a b)';
        const selections = [
          [4, 3],
          [2, 1],
        ];
        const doc = textNotation.docFromTextNotation(tn);
        expectLib.expect(textNotation.textAndSelections(doc)).toEqual([text, selections]);
      });
      it('creates a variety of multi-cursor positions and selections', () => {
        const tn = '|3a|3 <1b<1 >2c>2 d•>0e>0 f |4g<5<5';
        const text = 'a b c d•e f g'.replace(/•/g, '\n');
        const selections = [
          [8, 9],
          [3, 2],
          [4, 5],
          [0, 1],
          [12, 12],
          [13, 13],
        ];
        const doc = textNotation.docFromTextNotation(tn);
        expectLib.expect(textNotation.textAndSelections(doc)).toEqual([text, selections]);
      });
    });
    describe('CRLF line endings', () => {
      it('returns document text containing the same CRLF line endings as the input', () => {
        const tn = '(foo\r\nbar|)';
        const doc = textNotation.docFromTextNotation(tn);
        expectLib.expect(textNotation.getText(doc)).toBe('(foo\r\nbar)');
      });
      it('resolves cursor and selection positions to the same logical positions as the equivalent LF input', () => {
        const crlfCursorTn = '(foo\r\n|bar)';
        const lfCursorTn = '(foo\n|bar)';
        const crlfCursorDoc = textNotation.docFromTextNotation(crlfCursorTn);
        const lfCursorDoc = textNotation.docFromTextNotation(lfCursorTn);
        const [, [crlfCursorAnchor, crlfCursorActive]] =
          textNotation.textAndSelection(crlfCursorDoc);
        const [, [lfCursorAnchor, lfCursorActive]] = textNotation.textAndSelection(lfCursorDoc);
        expectLib.expect(crlfCursorDoc.model.getRowCol(crlfCursorAnchor)).toEqual(
          lfCursorDoc.model.getRowCol(lfCursorAnchor)
        );
        expectLib.expect(crlfCursorDoc.model.getRowCol(crlfCursorActive)).toEqual(
          lfCursorDoc.model.getRowCol(lfCursorActive)
        );

        const crlfSelectionTn = '(foo\r\n|bar|)';
        const lfSelectionTn = '(foo\n|bar|)';
        const crlfSelectionDoc = textNotation.docFromTextNotation(crlfSelectionTn);
        const lfSelectionDoc = textNotation.docFromTextNotation(lfSelectionTn);
        const [, [crlfSelectionAnchor, crlfSelectionActive]] =
          textNotation.textAndSelection(crlfSelectionDoc);
        const [, [lfSelectionAnchor, lfSelectionActive]] =
          textNotation.textAndSelection(lfSelectionDoc);
        expectLib.expect(crlfSelectionDoc.model.getRowCol(crlfSelectionAnchor)).toEqual(
          lfSelectionDoc.model.getRowCol(lfSelectionAnchor)
        );
        expectLib.expect(crlfSelectionDoc.model.getRowCol(crlfSelectionActive)).toEqual(
          lfSelectionDoc.model.getRowCol(lfSelectionActive)
        );
      });
      it('does not convert CRLF to LF', () => {
        const tn = '(foo\r\nbar\r\nbaz|)';
        const doc = textNotation.docFromTextNotation(tn);
        const text = textNotation.getText(doc);
        expectLib.expect(text).toBe('(foo\r\nbar\r\nbaz)');
        expectLib.expect(text.match(/\n/g)?.length).toBe(2);
        expectLib.expect(text.match(/\r\n/g)?.length).toBe(2);
      });
    });
  });
});
