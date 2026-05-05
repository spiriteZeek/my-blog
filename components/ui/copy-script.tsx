export function CopyScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
document.addEventListener('click', function(e) {
  var target = e.target;
  if (target.tagName === 'PRE') {
    var code = target.querySelector('code');
    if (code) {
      navigator.clipboard.writeText(code.textContent || '').then(function() {
        target.classList.add('copied');
        setTimeout(function() { target.classList.remove('copied'); }, 2000);
      });
    }
  } else if (target.closest('pre')) {
    var pre = target.closest('pre');
    var code = pre.querySelector('code');
    if (code) {
      navigator.clipboard.writeText(code.textContent || '').then(function() {
        pre.classList.add('copied');
        setTimeout(function() { pre.classList.remove('copied'); }, 2000);
      });
    }
  }
});
        `,
      }}
    />
  )
}
