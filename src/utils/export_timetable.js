import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export async function exportTimetableImage(element, device, previewWidth) {
  const scale = device.width / previewWidth;

  if (isSafari()) {
    const canvas = await html2canvas(element, {
      useCORS: true,
      backgroundColor: "#fff",
      scale,
    });
    saveAs(canvas.toDataURL("image/png"), "timetable.png");
    return;
  }

  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: scale,
  });
  saveAs(dataUrl, "timetable.png");
}
