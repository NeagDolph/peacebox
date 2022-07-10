var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) =>
  function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])((fn = 0))), res;
  };
var __commonJS = (cb, mod) =>
  function __require() {
    return (
      mod ||
        (0, cb[__getOwnPropNames(cb)[0]])((mod = {exports: {}}).exports, mod),
      mod.exports
    );
  };
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, {
          get: () => from[key2],
          enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable,
        });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, 'default', {
          value: mod,
          enumerable: true,
        })
      : target,
    mod,
  )
);
var __toCommonJS = mod =>
  __copyProps(__defProp({}, '__esModule', {value: true}), mod);

// node_modules/@sveltejs/kit/dist/chunks/multipart-parser.js
var multipart_parser_exports = {};
__export(multipart_parser_exports, {
  toFormData: () => toFormData,
});

function _fileName(headerValue) {
  const m2 = headerValue.match(
    /\bfilename=("(.*?)"|([^()<>@,;:\\"/[\]?={}\s\t]+))($|;\s)/i,
  );
  if (!m2) {
    return;
  }
  const match = m2[2] || m2[3] || '';
  let filename = match.slice(match.lastIndexOf('\\') + 1);
  filename = filename.replace(/%22/g, '"');
  filename = filename.replace(/&#(\d{4});/g, (m3, code) => {
    return String.fromCharCode(code);
  });
  return filename;
}
async function toFormData(Body2, ct) {
  if (!/multipart/i.test(ct)) {
    throw new TypeError('Failed to fetch');
  }
  const m2 = ct.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!m2) {
    throw new TypeError('no or bad content-type header, no multipart boundary');
  }
  const parser = new MultipartParser(m2[1] || m2[2]);
  let headerField;
  let headerValue;
  let entryValue;
  let entryName;
  let contentType;
  let filename;
  const entryChunks = [];
  const formData = new FormData();
  const onPartData = ui8a => {
    entryValue += decoder.decode(ui8a, {stream: true});
  };
  const appendToFile = ui8a => {
    entryChunks.push(ui8a);
  };
  const appendFileToFormData = () => {
    const file = new File(entryChunks, filename, {type: contentType});
    formData.append(entryName, file);
  };
  const appendEntryToFormData = () => {
    formData.append(entryName, entryValue);
  };
  const decoder = new TextDecoder('utf-8');
  decoder.decode();
  parser.onPartBegin = function () {
    parser.onPartData = onPartData;
    parser.onPartEnd = appendEntryToFormData;
    headerField = '';
    headerValue = '';
    entryValue = '';
    entryName = '';
    contentType = '';
    filename = null;
    entryChunks.length = 0;
  };
  parser.onHeaderField = function (ui8a) {
    headerField += decoder.decode(ui8a, {stream: true});
  };
  parser.onHeaderValue = function (ui8a) {
    headerValue += decoder.decode(ui8a, {stream: true});
  };
  parser.onHeaderEnd = function () {
    headerValue += decoder.decode();
    headerField = headerField.toLowerCase();
    if (headerField === 'content-disposition') {
      const m3 = headerValue.match(
        /\bname=("([^"]*)"|([^()<>@,;:\\"/[\]?={}\s\t]+))/i,
      );
      if (m3) {
        entryName = m3[2] || m3[3] || '';
      }
      filename = _fileName(headerValue);
      if (filename) {
        parser.onPartData = appendToFile;
        parser.onPartEnd = appendFileToFormData;
      }
    } else if (headerField === 'content-type') {
      contentType = headerValue;
    }
    headerValue = '';
    headerField = '';
  };
  for await (const chunk of Body2) {
    parser.write(chunk);
  }
  parser.end();
  return formData;
}

var s,
  S,
  f,
  F,
  LF,
  CR,
  SPACE,
  HYPHEN,
  COLON,
  A,
  Z,
  lower,
  noop,
  MultipartParser;
var init_multipart_parser = __esm({
  'node_modules/@sveltejs/kit/dist/chunks/multipart-parser.js'() {
    init_shims();
    init_polyfills();
    s = 0;
    S = {
      START_BOUNDARY: s++,
      HEADER_FIELD_START: s++,
      HEADER_FIELD: s++,
      HEADER_VALUE_START: s++,
      HEADER_VALUE: s++,
      HEADER_VALUE_ALMOST_DONE: s++,
      HEADERS_ALMOST_DONE: s++,
      PART_DATA_START: s++,
      PART_DATA: s++,
      END: s++,
    };
    f = 1;
    F = {
      PART_BOUNDARY: f,
      LAST_BOUNDARY: (f *= 2),
    };
    LF = 10;
    CR = 13;
    SPACE = 32;
    HYPHEN = 45;
    COLON = 58;
    A = 97;
    Z = 122;
    lower = c => c | 32;
    noop = () => {};
    MultipartParser = class {
      constructor(boundary) {
        this.index = 0;
        this.flags = 0;
        this.onHeaderEnd = noop;
        this.onHeaderField = noop;
        this.onHeadersEnd = noop;
        this.onHeaderValue = noop;
        this.onPartBegin = noop;
        this.onPartData = noop;
        this.onPartEnd = noop;
        this.boundaryChars = {};
        boundary = '\r\n--' + boundary;
        const ui8a = new Uint8Array(boundary.length);
        for (let i2 = 0; i2 < boundary.length; i2++) {
          ui8a[i2] = boundary.charCodeAt(i2);
          this.boundaryChars[ui8a[i2]] = true;
        }
        this.boundary = ui8a;
        this.lookbehind = new Uint8Array(this.boundary.length + 8);
        this.state = S.START_BOUNDARY;
      }
      write(data) {
        let i2 = 0;
        const length_ = data.length;
        let previousIndex = this.index;
        let {
          lookbehind,
          boundary,
          boundaryChars,
          index: index7,
          state,
          flag,
        } = this;
        const boundaryLength = this.boundary.length;
        const boundaryEnd = boundaryLength - 1;
        const bufferLength = data.length;
        let c;
        let cl;
        const mark = name => {
          this[name +"Mark"'] = i2;
        };
        const clear = name => {
          delete this[name +"Mark"'];
        };
        const callback = (callbackSymbol, start, end, ui8a) => {
          if (start === void 0 || start !== end) {
            this[callbackSymbol](ui8a && ui8a.subarray(start, end));
          }
        };
        const dataCallback = (name, clear2) => {
          const markSymbol = name +"Mark"';
          if (!(markSymbol in this)) {
            return;
          }
          if (clear2) {
            callback(name, this[markSymbol], i2, data);
            delete this[markSymbol];
          } else {
            callback(name, this[markSymbol], data.length, data);
            this[markSymbol] = 0;
          }
        };
        for (i2 = 0; i2 < length_; i2++) {
          c = data[i2];
          switch (state) {
            case S.START_BOUNDARY:
              if (index7 === boundary.length - 2) {
                if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else if (c !== CR) {
                  return;
                }
                index7++;
                break;
              } else if (index7 - 1 === boundary.length - 2) {
                if (flags & F.LAST_BOUNDARY && c === HYPHEN) {
                  state = S.END;
                  flags = 0;
                } else if (!(flags & F.LAST_BOUNDARY) && c === LF) {
                  index7 = 0;
                  callback("onPartBegin");
                  state = S.HEADER_FIELD_START;
                } else {
                  return;
                }
                break;
              }
              if (c !== boundary[index7 + 2]) {
                index7 = -2;
              }
              if (c === boundary[index7 + 2]) {
                index7++;
              }
              break;
            case S.HEADER_FIELD_START:
              state = S.HEADER_FIELD;
              mark("onHeaderField");
              index7 = 0;
            case S.HEADER_FIELD:
              if (c === CR) {
                clear('onHeaderField');
                state = S.HEADERS_ALMOST_DONE;
                break;
              }
              index7++;
              if (c === HYPHEN) {
                break;
              }
              if (c === COLON) {
                if (index7 === 1) {
                  return;
                }
                dataCallback('onHeaderField', true);
                state = S.HEADER_VALUE_START;
                break;
              }
              cl = lower(c);
              if (cl < A || cl > Z) {
                return;
              }
              break;
            case S.HEADER_VALUE_START:
              if (c === SPACE) {
                break;
              }
              mark('onHeaderValue');
              state = S.HEADER_VALUE;
            case S.HEADER_VALUE:
              if (c === CR) {
                dataCallback("onHeaderValue", true);
                callback("onHeaderEnd");
                state = S.HEADER_VALUE_ALMOST_DONE;
              }
              break;
            case S.HEADER_VALUE_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              state = S.HEADER_FIELD_START;
              break;
            case S.HEADERS_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              callback('onHeadersEnd');
              state = S.PART_DATA_START;
              break;
            case S.PART_DATA_START:
              state = S.PART_DATA;
              mark('onPartData');
            case S.PART_DATA:
              previousIndex = index7;
              if (index7 === 0) {
                i2 += boundaryEnd;
                while (i2 < bufferLength && !(data[i2] in boundaryChars)) {
                  i2 += boundaryLength;
                }
                i2 -= boundaryEnd;
                c = data[i2];
              }
              if (index7 < boundary.length) {
                if (boundary[index7] === c) {
                  if (index7 === 0) {
                    dataCallback('onPartData', true);
                  }
                  index7++;
                } else {
                  index7 = 0;
                }
              } else if (index7 === boundary.length) {
                index7++;
                if (c === CR) {
                  flags |= F.PART_BOUNDARY;
                } else if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else {
                  index7 = 0;
                }
              } else if (index7 - 1 === boundary.length) {
                if (flags & F.PART_BOUNDARY) {
                  index7 = 0;
                  if (c === LF) {
                    flags &= ~F.PART_BOUNDARY;
                    callback("onPartEnd");
                    callback("onPartBegin");
                    state = S.HEADER_FIELD_START;
                    break;
                  }
                } else if (flags & F.LAST_BOUNDARY) {
                  if (c === HYPHEN) {
                    callback('onPartEnd');
                    state = S.END;
                    flags = 0;
                  } else {
                    index7 = 0;
                  }
                } else {
                  index7 = 0;
                }
              }
              if (index7 > 0) {
                lookbehind[index7 - 1] = c;
              } else if (previousIndex > 0) {
                const _lookbehind = new Uint8Array(
                  lookbehind.buffer,
                  lookbehind.byteOffset,
                  lookbehind.byteLength
                );
                callback("onPartData", 0, previousIndex, _lookbehind);
                previousIndex = 0;
                mark("onPartData");
                i2--;
              }
              break;
            case S.END:
              break;
            default:
              throw new Error(`Unexpected state entered: ${state}`);
          }
        }
        dataCallback("onHeaderField");
        dataCallback("onHeaderValue");
        dataCallback("onPartData");
        this.index = index7;
        this.state = state;
        this.flags = flags;
      }
      end() {
        if (
          (this.state === S.HEADER_FIELD_START && this.index === 0) ||
          (this.state === S.PART_DATA && this.index === this.boundary.length)
        ) {
          this.onPartEnd();
        } else if (this.state !== S.END) {
          throw new Error('MultipartParser.end(): stream ended unexpectedly');
        }
      }
    };
  },
});

// node_modules/@sveltejs/kit/dist/node/polyfills.js
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError("`uri` does not appear to be a Data URI (must begin with \"data:\")");
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base642 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i2 = 1; i2 < meta.length; i2++) {
    if (meta[i2] === "base64") {
      base642 = true;
    } else {
      typeFull += `;${meta[i2]}`;
      if (meta[i2].indexOf("charset=") === 0) {
        charset = meta[i2].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base642 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
async function* toIterator(parts, clone2) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else if (ArrayBuffer.isView(part)) {
      if (clone2) {
        let position = part.byteOffset;
        const end = part.byteOffset + part.byteLength;
        while (position !== end) {
          const size = Math.min(end - position, POOL_SIZE);
          const chunk = part.buffer.slice(position, position + size);
          position += chunk.byteLength;
          yield new Uint8Array(chunk);
        }
      } else {
        yield part;
      }
    } else {
      let position = 0, b = part;
      while (position !== b.size) {
        const chunk = b.slice(position, Math.min(b.size, position + POOL_SIZE));
        const buffer = await chunk.arrayBuffer();
        position += buffer.byteLength;
        yield new Uint8Array(buffer);
      }
    }
  }
}
function formDataToBlob(F2, B = Blob$1) {
  var b = `${r()}${r()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), c = [], p = `--${b}\r
Content-Disposition: form-data; name="`;
  F2.forEach((v, n) => typeof v == "string" ? c.push(p + e(n) + `"\r
\r
${v.replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")}\r
`) : c.push(p + e(n) + `"; filename="${e(v.name, 1)}"\r
Content-Type: ${v.type || "application/octet-stream"}\r
\r
`, v, "\r\n"));
  c.push(`--${b}--`);
  return new B(c, { type: "multipart/form-data; boundary=" + b });
}
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  const { body } = data;
  if (body === null) {
    return import_node_buffer.Buffer.alloc(0);
  }
  if (!(body instanceof import_node_stream.default)) {
    return import_node_buffer.Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const error2 = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(error2);
        throw error2;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    const error_ = error2 instanceof FetchBaseError ? error2 : new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    throw error_;
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return import_node_buffer.Buffer.from(accum.join(""));
      }
      return import_node_buffer.Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
function fromRawHeaders(headers = []) {
  return new Headers2(headers.reduce((result, value, index7, array2) => {
    if (index7 % 2 === 0) {
      result.push(array2.slice(index7, index7 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
function stripURLForUseAsAReferrer(url, originOnly = false) {
  if (url == null) {
    return "no-referrer";
  }
  url = new URL(url);
  if (/^(about|blob|data):$/.test(url.protocol)) {
    return "no-referrer";
  }
  url.username = "";
  url.password = "";
  url.hash = "";
  if (originOnly) {
    url.pathname = "";
    url.search = "";
  }
  return url;
}
function validateReferrerPolicy(referrerPolicy) {
  if (!ReferrerPolicy.has(referrerPolicy)) {
    throw new TypeError(`Invalid referrerPolicy: ${referrerPolicy}`);
  }
  return referrerPolicy;
}
function isOriginPotentiallyTrustworthy(url) {
  if (/^(http|ws)s:$/.test(url.protocol)) {
    return true;
  }
  const hostIp = url.host.replace(/(^\[)|(]$)/g, "");
  const hostIPVersion = (0, import_node_net.isIP)(hostIp);
  if (hostIPVersion === 4 && /^127\./.test(hostIp)) {
    return true;
  }
  if (hostIPVersion === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(hostIp)) {
    return true;
  }
  if (/^(.+\.)*localhost$/.test(url.host)) {
    return false;
  }
  if (url.protocol === "file:") {
    return true;
  }
  return false;
}
function isUrlPotentiallyTrustworthy(url) {
  if (/^about:(blank|srcdoc)$/.test(url)) {
    return true;
  }
  if (url.protocol === "data:") {
    return true;
  }
  if (/^(blob|filesystem):$/.test(url.protocol)) {
    return true;
  }
  return isOriginPotentiallyTrustworthy(url);
}

function determineRequestsReferrer(request, { referrerURLCallback, referrerOriginCallback } = {}) {
  if (request.referrer === "no-referrer" || request.referrerPolicy === "") {
    return null;
  }
  const policy = request.referrerPolicy;
  if (request.referrer === "about:client") {
    return "no-referrer";
  }
  const referrerSource = request.referrer;
  let referrerURL = stripURLForUseAsAReferrer(referrerSource);
  let referrerOrigin = stripURLForUseAsAReferrer(referrerSource, true);
  if (referrerURL.toString().length > 4096) {
    referrerURL = referrerOrigin;
  }
  if (referrerURLCallback) {
    referrerURL = referrerURLCallback(referrerURL);
  }
  if (referrerOriginCallback) {
    referrerOrigin = referrerOriginCallback(referrerOrigin);
  }
  const currentURL = new URL(request.url);
  switch (policy) {
    case "no-referrer":
      return "no-referrer";
    case "origin":
      return referrerOrigin;
    case "unsafe-url":
      return referrerURL;
    case "strict-origin":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin.toString();
    case "strict-origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin;
    case "same-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return "no-referrer";
    case "origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return referrerOrigin;
    case "no-referrer-when-downgrade":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerURL;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${policy}`);
  }
}
function parseReferrerPolicyFromHeader(headers) {
  const policyTokens = (headers.get("referrer-policy") || "").split(/[,\s]+/);
  let policy = "";
  for (const token of policyTokens) {
    if (token && ReferrerPolicy.has(token)) {
      policy = token;
    }
  }
  return policy;
}
async function fetch2(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request2(url, options_);
    const { parsedURL, options } = getNodeRequestOptions(request);
    if (!supportedSchemas.has(parsedURL.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${parsedURL.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (parsedURL.protocol === "data:") {
      const data = dataUriToBuffer(request.url);
      const response2 = new Response2(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (parsedURL.protocol === "https:" ? import_node_https.default : import_node_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_node_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(parsedURL.toString(), options);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (error2) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${error2.message}`, "system", error2));
      finalize();
    });
    fixResponseChunkedTransferBadEnding(request_, (error2) => {
      response.body.destroy(error2);
    });
    if (process.version < "v14") {
      request_.on("socket", (s3) => {
        let endedWithEventsCount;
        s3.prependListener("end", () => {
          endedWithEventsCount = s3._eventsCount;
        });
        s3.prependListener("close", (hadError) => {
          if (response && endedWithEventsCount < s3._eventsCount && !hadError) {
            const error2 = new Error("Premature close");
            error2.code = "ERR_STREAM_PREMATURE_CLOSE";
            response.body.emit("error", error2);
          }
        });
      });
    }
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        let locationURL = null;
        try {
          locationURL = location === null ? null : new URL(location, request.url);
        } catch {
          if (request.redirect !== "manual") {
            reject(new FetchError(`uri requested responds with an invalid redirect URL: ${location}`, "invalid-redirect"));
            finalize();
            return;
          }
        }
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers2(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: clone(request),
              signal: request.signal,
              size: request.size,
              referrer: request.referrer,
              referrerPolicy: request.referrerPolicy
            };
            if (!isDomainOrSubdomain(request.url, locationURL)) {
              for (const name of ["authorization", "www-authenticate", "cookie", "cookie2"]) {
                requestOptions.headers.delete(name);
              }
            }
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_node_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            const responseReferrerPolicy = parseReferrerPolicyFromHeader(headers);
            if (responseReferrerPolicy) {
              requestOptions.referrerPolicy = responseReferrerPolicy;
            }
            resolve2(fetch2(new Request2(locationURL, requestOptions)));
            finalize();
            return;
          }
          default:
            return reject(new TypeError(`Redirect option '${request.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      if (signal) {
        response_.once("end", () => {
          signal.removeEventListener("abort", abortAndFinalize);
        });
      }
      let body = (0, import_node_stream.pipeline)(response_, new import_node_stream.PassThrough(), (error2) => {
        if (error2) {
          reject(error2);
        }
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_node_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_node_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_node_stream.pipeline)(body, import_node_zlib.default.createGunzip(zlibOptions), (error2) => {
          if (error2) {
            reject(error2);
          }
        });
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_node_stream.pipeline)(response_, new import_node_stream.PassThrough(), (error2) => {
          if (error2) {
            reject(error2);
          }
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_node_stream.pipeline)(body, import_node_zlib.default.createInflate(), (error2) => {
              if (error2) {
                reject(error2);
              }
            });
          } else {
            body = (0, import_node_stream.pipeline)(body, import_node_zlib.default.createInflateRaw(), (error2) => {
              if (error2) {
                reject(error2);
              }
            });
          }
          response = new Response2(body, responseOptions);
          resolve2(response);
        });
        raw.once("end", () => {
          if (!response) {
            response = new Response2(body, responseOptions);
            resolve2(response);
          }
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_node_stream.pipeline)(body, import_node_zlib.default.createBrotliDecompress(), (error2) => {
          if (error2) {
            reject(error2);
          }
        });
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response2(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request).catch(reject);
  });
}
function fixResponseChunkedTransferBadEnding(request, errorCallback) {
  const LAST_CHUNK = import_node_buffer.Buffer.from("0\r\n\r\n");
  let isChunkedTransfer = false;
  let properLastChunkReceived = false;
  let previousChunk;
  request.on("response", (response) => {
    const { headers } = response;
    isChunkedTransfer = headers["transfer-encoding"] === "chunked" && !headers["content-length"];
  });
  request.on("socket", (socket) => {
    const onSocketClose = () => {
      if (isChunkedTransfer && !properLastChunkReceived) {
        const error2 = new Error("Premature close");
        error2.code = "ERR_STREAM_PREMATURE_CLOSE";
        errorCallback(error2);
      }
    };
    socket.prependListener("close", onSocketClose);
    request.on("abort", () => {
      socket.removeListener("close", onSocketClose);
    });
    socket.on("data", (buf) => {
      properLastChunkReceived = import_node_buffer.Buffer.compare(buf.slice(-5), LAST_CHUNK) === 0;
      if (!properLastChunkReceived && previousChunk) {
        properLastChunkReceived = import_node_buffer.Buffer.compare(previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 && import_node_buffer.Buffer.compare(buf.slice(-2), LAST_CHUNK.slice(3)) === 0;
      }
      previousChunk = buf;
    });
  });
}
function installPolyfills() {
  for (const name in globals) {
    Object.defineProperty(globalThis, name, {
      enumerable: true,
      configurable: true,
      value: globals[name]
    });
  }
}

var import_node_http, import_node_https, import_node_zlib, import_node_stream, import_node_buffer, import_node_util,
  import_node_url, import_node_net, import_crypto, commonjsGlobal, ponyfill_es2018, POOL_SIZE$1, POOL_SIZE, _Blob,
  Blob2, Blob$1, _File, File, t, i, h, r, m, f2, e, x, FormData, FetchBaseError, FetchError, NAME,
  isURLSearchParameters, isBlob, isAbortSignal, isDomainOrSubdomain, pipeline, INTERNALS$2, Body, clone,
  getNonSpecFormDataBoundary, extractContentType, getTotalBytes, writeToStream, validateHeaderName, validateHeaderValue,
  Headers2, redirectStatus, isRedirect, INTERNALS$1, Response2, getSearch, ReferrerPolicy, DEFAULT_REFERRER_POLICY,
  INTERNALS, isRequest, doBadDataWarn, Request2, getNodeRequestOptions, AbortError, supportedSchemas, globals;
var init_polyfills = __esm({
  "node_modules/@sveltejs/kit/dist/node/polyfills.js"() {
    init_shims();
    import_node_http = __toESM(require("node:http"), 1);
    import_node_https = __toESM(require("node:https"), 1);
    import_node_zlib = __toESM(require("node:zlib"), 1);
    import_node_stream = __toESM(require("node:stream"), 1);
    import_node_buffer = require("node:buffer");
    import_node_util = require("node:util");
    import_node_url = require("node:url");
    import_node_net = require("node:net");
    import_crypto = require("crypto");
    commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    ponyfill_es2018 = { exports: {} };
    (function(module2, exports) {
      (function(global2, factory) {
        factory(exports);
      })(commonjsGlobal, function(exports2) {
        const SymbolPolyfill = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol : (description) => `Symbol(${description})`;

        function noop4() {
          return void 0;
        }

        function getGlobals() {
          if (typeof self !== "undefined") {
            return self;
          } else if (typeof window !== "undefined") {
            return window;
          } else if (typeof commonjsGlobal !== "undefined") {
            return commonjsGlobal;
          }
          return void 0;
        }
        const globals2 = getGlobals();
        function typeIsObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }

        const rethrowAssertionErrorRejection = noop4;
        const originalPromise = Promise;
        const originalPromiseThen = Promise.prototype.then;
        const originalPromiseResolve = Promise.resolve.bind(originalPromise);
        const originalPromiseReject = Promise.reject.bind(originalPromise);
        function newPromise(executor) {
          return new originalPromise(executor);
        }
        function promiseResolvedWith(value) {
          return originalPromiseResolve(value);
        }
        function promiseRejectedWith(reason) {
          return originalPromiseReject(reason);
        }
        function PerformPromiseThen(promise, onFulfilled, onRejected) {
          return originalPromiseThen.call(promise, onFulfilled, onRejected);
        }

        function uponPromise(promise, onFulfilled, onRejected) {
          PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
        }

        function uponFulfillment(promise, onFulfilled) {
          uponPromise(promise, onFulfilled);
        }

        function uponRejection(promise, onRejected) {
          uponPromise(promise, void 0, onRejected);
        }

        function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
          return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
        }

        function setPromiseIsHandledToTrue(promise) {
          PerformPromiseThen(promise, void 0, rethrowAssertionErrorRejection);
        }

        const queueMicrotask = (() => {
          const globalQueueMicrotask = globals2 && globals2.queueMicrotask;
          if (typeof globalQueueMicrotask === "function") {
            return globalQueueMicrotask;
          }
          const resolvedPromise = promiseResolvedWith(void 0);
          return (fn) => PerformPromiseThen(resolvedPromise, fn);
        })();
        function reflectCall(F2, V, args) {
          if (typeof F2 !== "function") {
            throw new TypeError("Argument is not a function");
          }
          return Function.prototype.apply.call(F2, V, args);
        }
        function promiseCall(F2, V, args) {
          try {
            return promiseResolvedWith(reflectCall(F2, V, args));
          } catch (value) {
            return promiseRejectedWith(value);
          }
        }
        const QUEUE_MAX_ARRAY_SIZE = 16384;
        class SimpleQueue {
          constructor() {
            this._cursor = 0;
            this._size = 0;
            this._front = {
              _elements: [],
              _next: void 0
            };
            this._back = this._front;
            this._cursor = 0;
            this._size = 0;
          }
          get length() {
            return this._size;
          }
          push(element) {
            const oldBack = this._back;
            let newBack = oldBack;
            if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
              newBack = {
                _elements: [],
                _next: void 0
              };
            }
            oldBack._elements.push(element);
            if (newBack !== oldBack) {
              this._back = newBack;
              oldBack._next = newBack;
            }
            ++this._size;
          }
          shift() {
            const oldFront = this._front;
            let newFront = oldFront;
            const oldCursor = this._cursor;
            let newCursor = oldCursor + 1;
            const elements = oldFront._elements;
            const element = elements[oldCursor];
            if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
              newFront = oldFront._next;
              newCursor = 0;
            }
            --this._size;
            this._cursor = newCursor;
            if (oldFront !== newFront) {
              this._front = newFront;
            }
            elements[oldCursor] = void 0;
            return element;
          }
          forEach(callback) {
            let i2 = this._cursor;
            let node = this._front;
            let elements = node._elements;
            while (i2 !== elements.length || node._next !== void 0) {
              if (i2 === elements.length) {
                node = node._next;
                elements = node._elements;
                i2 = 0;
                if (elements.length === 0) {
                  break;
                }
              }
              callback(elements[i2]);
              ++i2;
            }
          }
          peek() {
            const front = this._front;
            const cursor = this._cursor;
            return front._elements[cursor];
          }
        }
        function ReadableStreamReaderGenericInitialize(reader, stream) {
          reader._ownerReadableStream = stream;
          stream._reader = reader;
          if (stream._state === "readable") {
            defaultReaderClosedPromiseInitialize(reader);
          } else if (stream._state === "closed") {
            defaultReaderClosedPromiseInitializeAsResolved(reader);
          } else {
            defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
          }
        }
        function ReadableStreamReaderGenericCancel(reader, reason) {
          const stream = reader._ownerReadableStream;
          return ReadableStreamCancel(stream, reason);
        }
        function ReadableStreamReaderGenericRelease(reader) {
          if (reader._ownerReadableStream._state === "readable") {
            defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          } else {
            defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          }
          reader._ownerReadableStream._reader = void 0;
          reader._ownerReadableStream = void 0;
        }
        function readerLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released reader");
        }

        function defaultReaderClosedPromiseInitialize(reader) {
          reader._closedPromise = newPromise((resolve2, reject) => {
            reader._closedPromise_resolve = resolve2;
            reader._closedPromise_reject = reject;
          });
        }

        function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseReject(reader, reason);
        }

        function defaultReaderClosedPromiseInitializeAsResolved(reader) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseResolve(reader);
        }
        function defaultReaderClosedPromiseReject(reader, reason) {
          if (reader._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(reader._closedPromise);
          reader._closedPromise_reject(reason);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        function defaultReaderClosedPromiseResetToRejected(reader, reason) {
          defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
        }

        function defaultReaderClosedPromiseResolve(reader) {
          if (reader._closedPromise_resolve === void 0) {
            return;
          }
          reader._closedPromise_resolve(void 0);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }

        const AbortSteps = SymbolPolyfill("[[AbortSteps]]");
        const ErrorSteps = SymbolPolyfill("[[ErrorSteps]]");
        const CancelSteps = SymbolPolyfill("[[CancelSteps]]");
        const PullSteps = SymbolPolyfill("[[PullSteps]]");
        const NumberIsFinite = Number.isFinite || function(x2) {
          return typeof x2 === "number" && isFinite(x2);
        };
        const MathTrunc = Math.trunc || function(v) {
          return v < 0 ? Math.ceil(v) : Math.floor(v);
        };

        function isDictionary(x2) {
          return typeof x2 === "object" || typeof x2 === "function";
        }

        function assertDictionary(obj, context) {
          if (obj !== void 0 && !isDictionary(obj)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }

        function assertFunction(x2, context) {
          if (typeof x2 !== "function") {
            throw new TypeError(`${context} is not a function.`);
          }
        }
        function isObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        function assertObject(x2, context) {
          if (!isObject(x2)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertRequiredArgument(x2, position, context) {
          if (x2 === void 0) {
            throw new TypeError(`Parameter ${position} is required in '${context}'.`);
          }
        }
        function assertRequiredField(x2, field, context) {
          if (x2 === void 0) {
            throw new TypeError(`${field} is required in '${context}'.`);
          }
        }
        function convertUnrestrictedDouble(value) {
          return Number(value);
        }
        function censorNegativeZero(x2) {
          return x2 === 0 ? 0 : x2;
        }
        function integerPart(x2) {
          return censorNegativeZero(MathTrunc(x2));
        }
        function convertUnsignedLongLongWithEnforceRange(value, context) {
          const lowerBound = 0;
          const upperBound = Number.MAX_SAFE_INTEGER;
          let x2 = Number(value);
          x2 = censorNegativeZero(x2);
          if (!NumberIsFinite(x2)) {
            throw new TypeError(`${context} is not a finite number`);
          }
          x2 = integerPart(x2);
          if (x2 < lowerBound || x2 > upperBound) {
            throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
          }
          if (!NumberIsFinite(x2) || x2 === 0) {
            return 0;
          }
          return x2;
        }
        function assertReadableStream(x2, context) {
          if (!IsReadableStream(x2)) {
            throw new TypeError(`${context} is not a ReadableStream.`);
          }
        }
        function AcquireReadableStreamDefaultReader(stream) {
          return new ReadableStreamDefaultReader(stream);
        }
        function ReadableStreamAddReadRequest(stream, readRequest) {
          stream._reader._readRequests.push(readRequest);
        }
        function ReadableStreamFulfillReadRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readRequest = reader._readRequests.shift();
          if (done) {
            readRequest._closeSteps();
          } else {
            readRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadRequests(stream) {
          return stream._reader._readRequests.length;
        }
        function ReadableStreamHasDefaultReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamDefaultReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamDefaultReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("read"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: () => resolvePromise({ value: void 0, done: true }),
              _errorSteps: (e2) => rejectPromise(e2)
            };
            ReadableStreamDefaultReaderRead(this, readRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamDefaultReader(this)) {
              throw defaultReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }

        Object.defineProperties(ReadableStreamDefaultReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultReader",
            configurable: true
          });
        }

        function IsReadableStreamDefaultReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultReader;
        }
        function ReadableStreamDefaultReaderRead(reader, readRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "closed") {
            readRequest._closeSteps();
          } else if (stream._state === "errored") {
            readRequest._errorSteps(stream._storedError);
          } else {
            stream._readableStreamController[PullSteps](readRequest);
          }
        }

        function defaultReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
        }

        const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
        }).prototype);

        class ReadableStreamAsyncIteratorImpl {
          constructor(reader, preventCancel) {
            this._ongoingPromise = void 0;
            this._isFinished = false;
            this._reader = reader;
            this._preventCancel = preventCancel;
          }

          next() {
            const nextSteps = () => this._nextSteps();
            this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
            return this._ongoingPromise;
          }
          return(value) {
            const returnSteps = () => this._returnSteps(value);
            return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
          }
          _nextSteps() {
            if (this._isFinished) {
              return Promise.resolve({ value: void 0, done: true });
            }
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("iterate"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => {
                this._ongoingPromise = void 0;
                queueMicrotask(() => resolvePromise({ value: chunk, done: false }));
              },
              _closeSteps: () => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                resolvePromise({ value: void 0, done: true });
              },
              _errorSteps: (reason) => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                rejectPromise(reason);
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promise;
          }
          _returnSteps(value) {
            if (this._isFinished) {
              return Promise.resolve({ value, done: true });
            }
            this._isFinished = true;
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("finish iterating"));
            }
            if (!this._preventCancel) {
              const result = ReadableStreamReaderGenericCancel(reader, value);
              ReadableStreamReaderGenericRelease(reader);
              return transformPromiseWith(result, () => ({ value, done: true }));
            }
            ReadableStreamReaderGenericRelease(reader);
            return promiseResolvedWith({ value, done: true });
          }
        }
        const ReadableStreamAsyncIteratorPrototype = {
          next() {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
            }
            return this._asyncIteratorImpl.next();
          },
          return(value) {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
            }
            return this._asyncIteratorImpl.return(value);
          }
        };
        if (AsyncIteratorPrototype !== void 0) {
          Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
        }
        function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
          const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
          iterator._asyncIteratorImpl = impl;
          return iterator;
        }
        function IsReadableStreamAsyncIterator(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_asyncIteratorImpl")) {
            return false;
          }
          try {
            return x2._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
          } catch (_a) {
            return false;
          }
        }

        function streamAsyncIteratorBrandCheckException(name) {
          return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
        }

        const NumberIsNaN = Number.isNaN || function(x2) {
          return x2 !== x2;
        };

        function CreateArrayFromList(elements) {
          return elements.slice();
        }

        function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
          new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
        }

        function TransferArrayBuffer(O) {
          return O;
        }

        function IsDetachedBuffer(O) {
          return false;
        }
        function ArrayBufferSlice(buffer, begin, end) {
          if (buffer.slice) {
            return buffer.slice(begin, end);
          }
          const length = end - begin;
          const slice = new ArrayBuffer(length);
          CopyDataBlockBytes(slice, 0, buffer, begin, length);
          return slice;
        }
        function IsNonNegativeNumber(v) {
          if (typeof v !== "number") {
            return false;
          }
          if (NumberIsNaN(v)) {
            return false;
          }
          if (v < 0) {
            return false;
          }
          return true;
        }
        function CloneAsUint8Array(O) {
          const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
          return new Uint8Array(buffer);
        }
        function DequeueValue(container) {
          const pair = container._queue.shift();
          container._queueTotalSize -= pair.size;
          if (container._queueTotalSize < 0) {
            container._queueTotalSize = 0;
          }
          return pair.value;
        }
        function EnqueueValueWithSize(container, value, size) {
          if (!IsNonNegativeNumber(size) || size === Infinity) {
            throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
          }
          container._queue.push({ value, size });
          container._queueTotalSize += size;
        }
        function PeekQueueValue(container) {
          const pair = container._queue.peek();
          return pair.value;
        }
        function ResetQueue(container) {
          container._queue = new SimpleQueue();
          container._queueTotalSize = 0;
        }
        class ReadableStreamBYOBRequest {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get view() {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("view");
            }
            return this._view;
          }
          respond(bytesWritten) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respond");
            }
            assertRequiredArgument(bytesWritten, 1, "respond");
            bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(this._view.buffer))
              ;
            ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
          }
          respondWithNewView(view) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respondWithNewView");
            }
            assertRequiredArgument(view, 1, "respondWithNewView");
            if (!ArrayBuffer.isView(view)) {
              throw new TypeError("You can only respond with array buffer views");
            }
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
          }
        }

        Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
          respond: { enumerable: true },
          respondWithNewView: { enumerable: true },
          view: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBRequest.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBRequest",
            configurable: true
          });
        }

        class ReadableByteStreamController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }

          get byobRequest() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("byobRequest");
            }
            return ReadableByteStreamControllerGetBYOBRequest(this);
          }
          get desiredSize() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("desiredSize");
            }
            return ReadableByteStreamControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("close");
            }
            if (this._closeRequested) {
              throw new TypeError("The stream has already been closed; do not close it again!");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
            }
            ReadableByteStreamControllerClose(this);
          }
          enqueue(chunk) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("enqueue");
            }
            assertRequiredArgument(chunk, 1, "enqueue");
            if (!ArrayBuffer.isView(chunk)) {
              throw new TypeError("chunk must be an array buffer view");
            }
            if (chunk.byteLength === 0) {
              throw new TypeError("chunk must have non-zero byteLength");
            }
            if (chunk.buffer.byteLength === 0) {
              throw new TypeError(`chunk's buffer must have non-zero byteLength`);
            }
            if (this._closeRequested) {
              throw new TypeError("stream is closed or draining");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
            }
            ReadableByteStreamControllerEnqueue(this, chunk);
          }
          error(e2 = void 0) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("error");
            }
            ReadableByteStreamControllerError(this, e2);
          }
          [CancelSteps](reason) {
            ReadableByteStreamControllerClearPendingPullIntos(this);
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableByteStreamControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableByteStream;
            if (this._queueTotalSize > 0) {
              const entry7 = this._queue.shift();
              this._queueTotalSize -= entry7.byteLength;
              ReadableByteStreamControllerHandleQueueDrain(this);
              const view = new Uint8Array(entry7.buffer, entry7.byteOffset, entry7.byteLength);
              readRequest._chunkSteps(view);
              return;
            }
            const autoAllocateChunkSize = this._autoAllocateChunkSize;
            if (autoAllocateChunkSize !== void 0) {
              let buffer;
              try {
                buffer = new ArrayBuffer(autoAllocateChunkSize);
              } catch (bufferE) {
                readRequest._errorSteps(bufferE);
                return;
              }
              const pullIntoDescriptor = {
                buffer,
                bufferByteLength: autoAllocateChunkSize,
                byteOffset: 0,
                byteLength: autoAllocateChunkSize,
                bytesFilled: 0,
                elementSize: 1,
                viewConstructor: Uint8Array,
                readerType: "default"
              };
              this._pendingPullIntos.push(pullIntoDescriptor);
            }
            ReadableStreamAddReadRequest(stream, readRequest);
            ReadableByteStreamControllerCallPullIfNeeded(this);
          }
        }

        Object.defineProperties(ReadableByteStreamController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          byobRequest: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableByteStreamController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableByteStreamController",
            configurable: true
          });
        }

        function IsReadableByteStreamController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableByteStream")) {
            return false;
          }
          return x2 instanceof ReadableByteStreamController;
        }
        function IsReadableStreamBYOBRequest(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_associatedReadableByteStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBRequest;
        }
        function ReadableByteStreamControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableByteStreamControllerCallPullIfNeeded(controller);
            }
          }, (e2) => {
            ReadableByteStreamControllerError(controller, e2);
          });
        }

        function ReadableByteStreamControllerClearPendingPullIntos(controller) {
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          controller._pendingPullIntos = new SimpleQueue();
        }

        function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
          let done = false;
          if (stream._state === "closed") {
            done = true;
          }
          const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
          if (pullIntoDescriptor.readerType === "default") {
            ReadableStreamFulfillReadRequest(stream, filledView, done);
          } else {
            ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
          }
        }

        function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
          const bytesFilled = pullIntoDescriptor.bytesFilled;
          const elementSize = pullIntoDescriptor.elementSize;
          return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
        }

        function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
          controller._queue.push({ buffer, byteOffset, byteLength });
          controller._queueTotalSize += byteLength;
        }

        function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
          const elementSize = pullIntoDescriptor.elementSize;
          const currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
          const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
          const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
          const maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
          let totalBytesToCopyRemaining = maxBytesToCopy;
          let ready = false;
          if (maxAlignedBytes > currentAlignedBytes) {
            totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
            ready = true;
          }
          const queue = controller._queue;
          while (totalBytesToCopyRemaining > 0) {
            const headOfQueue = queue.peek();
            const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
            const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
            if (headOfQueue.byteLength === bytesToCopy) {
              queue.shift();
            } else {
              headOfQueue.byteOffset += bytesToCopy;
              headOfQueue.byteLength -= bytesToCopy;
            }
            controller._queueTotalSize -= bytesToCopy;
            ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
            totalBytesToCopyRemaining -= bytesToCopy;
          }
          return ready;
        }

        function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
          pullIntoDescriptor.bytesFilled += size;
        }

        function ReadableByteStreamControllerHandleQueueDrain(controller) {
          if (controller._queueTotalSize === 0 && controller._closeRequested) {
            ReadableByteStreamControllerClearAlgorithms(controller);
            ReadableStreamClose(controller._controlledReadableByteStream);
          } else {
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
        }

        function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
          if (controller._byobRequest === null) {
            return;
          }
          controller._byobRequest._associatedReadableByteStreamController = void 0;
          controller._byobRequest._view = null;
          controller._byobRequest = null;
        }

        function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
          while (controller._pendingPullIntos.length > 0) {
            if (controller._queueTotalSize === 0) {
              return;
            }
            const pullIntoDescriptor = controller._pendingPullIntos.peek();
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
            }
          }
        }

        function ReadableByteStreamControllerPullInto(controller, view, readIntoRequest) {
          const stream = controller._controlledReadableByteStream;
          let elementSize = 1;
          if (view.constructor !== DataView) {
            elementSize = view.constructor.BYTES_PER_ELEMENT;
          }
          const ctor = view.constructor;
          const buffer = TransferArrayBuffer(view.buffer);
          const pullIntoDescriptor = {
            buffer,
            bufferByteLength: buffer.byteLength,
            byteOffset: view.byteOffset,
            byteLength: view.byteLength,
            bytesFilled: 0,
            elementSize,
            viewConstructor: ctor,
            readerType: "byob"
          };
          if (controller._pendingPullIntos.length > 0) {
            controller._pendingPullIntos.push(pullIntoDescriptor);
            ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
            return;
          }
          if (stream._state === "closed") {
            const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
            readIntoRequest._closeSteps(emptyView);
            return;
          }
          if (controller._queueTotalSize > 0) {
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
              ReadableByteStreamControllerHandleQueueDrain(controller);
              readIntoRequest._chunkSteps(filledView);
              return;
            }
            if (controller._closeRequested) {
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              readIntoRequest._errorSteps(e2);
              return;
            }
          }
          controller._pendingPullIntos.push(pullIntoDescriptor);
          ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }

        function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
          const stream = controller._controlledReadableByteStream;
          if (ReadableStreamHasBYOBReader(stream)) {
            while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
              const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
            }
          }
        }

        function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
          ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
          if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
            return;
          }
          ReadableByteStreamControllerShiftPendingPullInto(controller);
          const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
          if (remainderSize > 0) {
            const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            const remainder = ArrayBufferSlice(pullIntoDescriptor.buffer, end - remainderSize, end);
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
          }
          pullIntoDescriptor.bytesFilled -= remainderSize;
          ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
        }

        function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            ReadableByteStreamControllerRespondInClosedState(controller);
          } else {
            ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerShiftPendingPullInto(controller) {
          const descriptor = controller._pendingPullIntos.shift();
          return descriptor;
        }
        function ReadableByteStreamControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return false;
          }
          if (controller._closeRequested) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableByteStreamControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
        }
        function ReadableByteStreamControllerClose(controller) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          if (controller._queueTotalSize > 0) {
            controller._closeRequested = true;
            return;
          }
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (firstPendingPullInto.bytesFilled > 0) {
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              throw e2;
            }
          }
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamClose(stream);
        }
        function ReadableByteStreamControllerEnqueue(controller, chunk) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          const buffer = chunk.buffer;
          const byteOffset = chunk.byteOffset;
          const byteLength = chunk.byteLength;
          const transferredBuffer = TransferArrayBuffer(buffer);
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (IsDetachedBuffer(firstPendingPullInto.buffer))
              ;
            firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
          }
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          if (ReadableStreamHasDefaultReader(stream)) {
            if (ReadableStreamGetNumReadRequests(stream) === 0) {
              ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            } else {
              if (controller._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerShiftPendingPullInto(controller);
              }
              const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
              ReadableStreamFulfillReadRequest(stream, transferredView, false);
            }
          } else if (ReadableStreamHasBYOBReader(stream)) {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
          } else {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerError(controller, e2) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return;
          }
          ReadableByteStreamControllerClearPendingPullIntos(controller);
          ResetQueue(controller);
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
        }
        function ReadableByteStreamControllerGetBYOBRequest(controller) {
          if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
            const firstDescriptor = controller._pendingPullIntos.peek();
            const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
            const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
            SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
            controller._byobRequest = byobRequest;
          }
          return controller._byobRequest;
        }
        function ReadableByteStreamControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableByteStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableByteStreamControllerRespond(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (bytesWritten !== 0) {
              throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
            }
          } else {
            if (bytesWritten === 0) {
              throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
            }
            if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
              throw new RangeError("bytesWritten out of range");
            }
          }
          firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
          ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
        }

        function ReadableByteStreamControllerRespondWithNewView(controller, view) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (view.byteLength !== 0) {
              throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
            }
          } else {
            if (view.byteLength === 0) {
              throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
            }
          }
          if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
            throw new RangeError("The region specified by view does not match byobRequest");
          }
          if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
            throw new RangeError("The buffer of view has different capacity than byobRequest");
          }
          if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
            throw new RangeError("The region specified by view is larger than byobRequest");
          }
          const viewByteLength = view.byteLength;
          firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
          ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
        }

        function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
          controller._controlledReadableByteStream = stream;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._byobRequest = null;
          controller._queue = controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._closeRequested = false;
          controller._started = false;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          controller._autoAllocateChunkSize = autoAllocateChunkSize;
          controller._pendingPullIntos = new SimpleQueue();
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }, (r2) => {
            ReadableByteStreamControllerError(controller, r2);
          });
        }

        function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
          const controller = Object.create(ReadableByteStreamController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingByteSource.start !== void 0) {
            startAlgorithm = () => underlyingByteSource.start(controller);
          }
          if (underlyingByteSource.pull !== void 0) {
            pullAlgorithm = () => underlyingByteSource.pull(controller);
          }
          if (underlyingByteSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingByteSource.cancel(reason);
          }
          const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
          if (autoAllocateChunkSize === 0) {
            throw new TypeError("autoAllocateChunkSize must be greater than 0");
          }
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
        }
        function SetUpReadableStreamBYOBRequest(request, controller, view) {
          request._associatedReadableByteStreamController = controller;
          request._view = view;
        }
        function byobRequestBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
        }
        function byteStreamControllerBrandCheckException(name) {
          return new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
        }
        function AcquireReadableStreamBYOBReader(stream) {
          return new ReadableStreamBYOBReader(stream);
        }
        function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
          stream._reader._readIntoRequests.push(readIntoRequest);
        }
        function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readIntoRequest = reader._readIntoRequests.shift();
          if (done) {
            readIntoRequest._closeSteps(chunk);
          } else {
            readIntoRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadIntoRequests(stream) {
          return stream._reader._readIntoRequests.length;
        }
        function ReadableStreamHasBYOBReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamBYOBReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamBYOBReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            if (!IsReadableByteStreamController(stream._readableStreamController)) {
              throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readIntoRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read(view) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("read"));
            }
            if (!ArrayBuffer.isView(view)) {
              return promiseRejectedWith(new TypeError("view must be an array buffer view"));
            }
            if (view.byteLength === 0) {
              return promiseRejectedWith(new TypeError("view must have non-zero byteLength"));
            }
            if (view.buffer.byteLength === 0) {
              return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readIntoRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: (chunk) => resolvePromise({ value: chunk, done: true }),
              _errorSteps: (e2) => rejectPromise(e2)
            };
            ReadableStreamBYOBReaderRead(this, view, readIntoRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamBYOBReader(this)) {
              throw byobReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readIntoRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }

        Object.defineProperties(ReadableStreamBYOBReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBReader",
            configurable: true
          });
        }

        function IsReadableStreamBYOBReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readIntoRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBReader;
        }
        function ReadableStreamBYOBReaderRead(reader, view, readIntoRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "errored") {
            readIntoRequest._errorSteps(stream._storedError);
          } else {
            ReadableByteStreamControllerPullInto(stream._readableStreamController, view, readIntoRequest);
          }
        }
        function byobReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
        }
        function ExtractHighWaterMark(strategy, defaultHWM) {
          const { highWaterMark } = strategy;
          if (highWaterMark === void 0) {
            return defaultHWM;
          }
          if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
            throw new RangeError("Invalid highWaterMark");
          }
          return highWaterMark;
        }
        function ExtractSizeAlgorithm(strategy) {
          const { size } = strategy;
          if (!size) {
            return () => 1;
          }
          return size;
        }
        function convertQueuingStrategy(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          const size = init2 === null || init2 === void 0 ? void 0 : init2.size;
          return {
            highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
            size: size === void 0 ? void 0 : convertQueuingStrategySize(size, `${context} has member 'size' that`)
          };
        }
        function convertQueuingStrategySize(fn, context) {
          assertFunction(fn, context);
          return (chunk) => convertUnrestrictedDouble(fn(chunk));
        }
        function convertUnderlyingSink(original, context) {
          assertDictionary(original, context);
          const abort = original === null || original === void 0 ? void 0 : original.abort;
          const close = original === null || original === void 0 ? void 0 : original.close;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          const write = original === null || original === void 0 ? void 0 : original.write;
          return {
            abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
            close: close === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
            write: write === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
            type
          };
        }
        function convertUnderlyingSinkAbortCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSinkCloseCallback(fn, original, context) {
          assertFunction(fn, context);
          return () => promiseCall(fn, original, []);
        }
        function convertUnderlyingSinkStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertUnderlyingSinkWriteCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        function assertWritableStream(x2, context) {
          if (!IsWritableStream(x2)) {
            throw new TypeError(`${context} is not a WritableStream.`);
          }
        }
        function isAbortSignal2(value) {
          if (typeof value !== "object" || value === null) {
            return false;
          }
          try {
            return typeof value.aborted === "boolean";
          } catch (_a) {
            return false;
          }
        }

        const supportsAbortController = typeof AbortController === "function";
        function createAbortController() {
          if (supportsAbortController) {
            return new AbortController();
          }
          return void 0;
        }
        class WritableStream {
          constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
            if (rawUnderlyingSink === void 0) {
              rawUnderlyingSink = null;
            } else {
              assertObject(rawUnderlyingSink, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
            InitializeWritableStream(this);
            const type = underlyingSink.type;
            if (type !== void 0) {
              throw new RangeError("Invalid type is specified");
            }
            const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
            const highWaterMark = ExtractHighWaterMark(strategy, 1);
            SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
          }
          get locked() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("locked");
            }
            return IsWritableStreamLocked(this);
          }
          abort(reason = void 0) {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("abort"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot abort a stream that already has a writer"));
            }
            return WritableStreamAbort(this, reason);
          }
          close() {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("close"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot close a stream that already has a writer"));
            }
            if (WritableStreamCloseQueuedOrInFlight(this)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamClose(this);
          }
          getWriter() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("getWriter");
            }
            return AcquireWritableStreamDefaultWriter(this);
          }
        }

        Object.defineProperties(WritableStream.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          getWriter: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStream.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStream",
            configurable: true
          });
        }

        function AcquireWritableStreamDefaultWriter(stream) {
          return new WritableStreamDefaultWriter(stream);
        }

        function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(WritableStream.prototype);
          InitializeWritableStream(stream);
          const controller = Object.create(WritableStreamDefaultController.prototype);
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }

        function InitializeWritableStream(stream) {
          stream._state = "writable";
          stream._storedError = void 0;
          stream._writer = void 0;
          stream._writableStreamController = void 0;
          stream._writeRequests = new SimpleQueue();
          stream._inFlightWriteRequest = void 0;
          stream._closeRequest = void 0;
          stream._inFlightCloseRequest = void 0;
          stream._pendingAbortRequest = void 0;
          stream._backpressure = false;
        }
        function IsWritableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_writableStreamController")) {
            return false;
          }
          return x2 instanceof WritableStream;
        }
        function IsWritableStreamLocked(stream) {
          if (stream._writer === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamAbort(stream, reason) {
          var _a;
          if (stream._state === "closed" || stream._state === "errored") {
            return promiseResolvedWith(void 0);
          }
          stream._writableStreamController._abortReason = reason;
          (_a = stream._writableStreamController._abortController) === null || _a === void 0 ? void 0 : _a.abort();
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseResolvedWith(void 0);
          }
          if (stream._pendingAbortRequest !== void 0) {
            return stream._pendingAbortRequest._promise;
          }
          let wasAlreadyErroring = false;
          if (state === "erroring") {
            wasAlreadyErroring = true;
            reason = void 0;
          }
          const promise = newPromise((resolve2, reject) => {
            stream._pendingAbortRequest = {
              _promise: void 0,
              _resolve: resolve2,
              _reject: reject,
              _reason: reason,
              _wasAlreadyErroring: wasAlreadyErroring
            };
          });
          stream._pendingAbortRequest._promise = promise;
          if (!wasAlreadyErroring) {
            WritableStreamStartErroring(stream, reason);
          }
          return promise;
        }
        function WritableStreamClose(stream) {
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseRejectedWith(new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
          }
          const promise = newPromise((resolve2, reject) => {
            const closeRequest = {
              _resolve: resolve2,
              _reject: reject
            };
            stream._closeRequest = closeRequest;
          });
          const writer = stream._writer;
          if (writer !== void 0 && stream._backpressure && state === "writable") {
            defaultWriterReadyPromiseResolve(writer);
          }
          WritableStreamDefaultControllerClose(stream._writableStreamController);
          return promise;
        }
        function WritableStreamAddWriteRequest(stream) {
          const promise = newPromise((resolve2, reject) => {
            const writeRequest = {
              _resolve: resolve2,
              _reject: reject
            };
            stream._writeRequests.push(writeRequest);
          });
          return promise;
        }
        function WritableStreamDealWithRejection(stream, error2) {
          const state = stream._state;
          if (state === "writable") {
            WritableStreamStartErroring(stream, error2);
            return;
          }
          WritableStreamFinishErroring(stream);
        }
        function WritableStreamStartErroring(stream, reason) {
          const controller = stream._writableStreamController;
          stream._state = "erroring";
          stream._storedError = reason;
          const writer = stream._writer;
          if (writer !== void 0) {
            WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
          }
          if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
            WritableStreamFinishErroring(stream);
          }
        }
        function WritableStreamFinishErroring(stream) {
          stream._state = "errored";
          stream._writableStreamController[ErrorSteps]();
          const storedError = stream._storedError;
          stream._writeRequests.forEach((writeRequest) => {
            writeRequest._reject(storedError);
          });
          stream._writeRequests = new SimpleQueue();
          if (stream._pendingAbortRequest === void 0) {
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const abortRequest = stream._pendingAbortRequest;
          stream._pendingAbortRequest = void 0;
          if (abortRequest._wasAlreadyErroring) {
            abortRequest._reject(storedError);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
          uponPromise(promise, () => {
            abortRequest._resolve();
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          }, (reason) => {
            abortRequest._reject(reason);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          });
        }
        function WritableStreamFinishInFlightWrite(stream) {
          stream._inFlightWriteRequest._resolve(void 0);
          stream._inFlightWriteRequest = void 0;
        }
        function WritableStreamFinishInFlightWriteWithError(stream, error2) {
          stream._inFlightWriteRequest._reject(error2);
          stream._inFlightWriteRequest = void 0;
          WritableStreamDealWithRejection(stream, error2);
        }
        function WritableStreamFinishInFlightClose(stream) {
          stream._inFlightCloseRequest._resolve(void 0);
          stream._inFlightCloseRequest = void 0;
          const state = stream._state;
          if (state === "erroring") {
            stream._storedError = void 0;
            if (stream._pendingAbortRequest !== void 0) {
              stream._pendingAbortRequest._resolve();
              stream._pendingAbortRequest = void 0;
            }
          }
          stream._state = "closed";
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseResolve(writer);
          }
        }
        function WritableStreamFinishInFlightCloseWithError(stream, error2) {
          stream._inFlightCloseRequest._reject(error2);
          stream._inFlightCloseRequest = void 0;
          if (stream._pendingAbortRequest !== void 0) {
            stream._pendingAbortRequest._reject(error2);
            stream._pendingAbortRequest = void 0;
          }
          WritableStreamDealWithRejection(stream, error2);
        }
        function WritableStreamCloseQueuedOrInFlight(stream) {
          if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamHasOperationMarkedInFlight(stream) {
          if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamMarkCloseRequestInFlight(stream) {
          stream._inFlightCloseRequest = stream._closeRequest;
          stream._closeRequest = void 0;
        }
        function WritableStreamMarkFirstWriteRequestInFlight(stream) {
          stream._inFlightWriteRequest = stream._writeRequests.shift();
        }
        function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
          if (stream._closeRequest !== void 0) {
            stream._closeRequest._reject(stream._storedError);
            stream._closeRequest = void 0;
          }
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseReject(writer, stream._storedError);
          }
        }
        function WritableStreamUpdateBackpressure(stream, backpressure) {
          const writer = stream._writer;
          if (writer !== void 0 && backpressure !== stream._backpressure) {
            if (backpressure) {
              defaultWriterReadyPromiseReset(writer);
            } else {
              defaultWriterReadyPromiseResolve(writer);
            }
          }
          stream._backpressure = backpressure;
        }
        class WritableStreamDefaultWriter {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
            assertWritableStream(stream, "First parameter");
            if (IsWritableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive writing by another writer");
            }
            this._ownerWritableStream = stream;
            stream._writer = this;
            const state = stream._state;
            if (state === "writable") {
              if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
                defaultWriterReadyPromiseInitialize(this);
              } else {
                defaultWriterReadyPromiseInitializeAsResolved(this);
              }
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "erroring") {
              defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "closed") {
              defaultWriterReadyPromiseInitializeAsResolved(this);
              defaultWriterClosedPromiseInitializeAsResolved(this);
            } else {
              const storedError = stream._storedError;
              defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
              defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
            }
          }
          get closed() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          get desiredSize() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("desiredSize");
            }
            if (this._ownerWritableStream === void 0) {
              throw defaultWriterLockException("desiredSize");
            }
            return WritableStreamDefaultWriterGetDesiredSize(this);
          }
          get ready() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
            }
            return this._readyPromise;
          }
          abort(reason = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("abort"));
            }
            return WritableStreamDefaultWriterAbort(this, reason);
          }
          close() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("close"));
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("close"));
            }
            if (WritableStreamCloseQueuedOrInFlight(stream)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamDefaultWriterClose(this);
          }
          releaseLock() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("releaseLock");
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return;
            }
            WritableStreamDefaultWriterRelease(this);
          }
          write(chunk = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("write"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("write to"));
            }
            return WritableStreamDefaultWriterWrite(this, chunk);
          }
        }

        Object.defineProperties(WritableStreamDefaultWriter.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          releaseLock: { enumerable: true },
          write: { enumerable: true },
          closed: { enumerable: true },
          desiredSize: { enumerable: true },
          ready: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultWriter.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultWriter",
            configurable: true
          });
        }

        function IsWritableStreamDefaultWriter(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_ownerWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultWriter;
        }
        function WritableStreamDefaultWriterAbort(writer, reason) {
          const stream = writer._ownerWritableStream;
          return WritableStreamAbort(stream, reason);
        }
        function WritableStreamDefaultWriterClose(writer) {
          const stream = writer._ownerWritableStream;
          return WritableStreamClose(stream);
        }
        function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          return WritableStreamDefaultWriterClose(writer);
        }

        function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error2) {
          if (writer._closedPromiseState === "pending") {
            defaultWriterClosedPromiseReject(writer, error2);
          } else {
            defaultWriterClosedPromiseResetToRejected(writer, error2);
          }
        }

        function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error2) {
          if (writer._readyPromiseState === "pending") {
            defaultWriterReadyPromiseReject(writer, error2);
          } else {
            defaultWriterReadyPromiseResetToRejected(writer, error2);
          }
        }

        function WritableStreamDefaultWriterGetDesiredSize(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (state === "errored" || state === "erroring") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
        }
        function WritableStreamDefaultWriterRelease(writer) {
          const stream = writer._ownerWritableStream;
          const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
          WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
          WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
          stream._writer = void 0;
          writer._ownerWritableStream = void 0;
        }
        function WritableStreamDefaultWriterWrite(writer, chunk) {
          const stream = writer._ownerWritableStream;
          const controller = stream._writableStreamController;
          const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
          if (stream !== writer._ownerWritableStream) {
            return promiseRejectedWith(defaultWriterLockException("write to"));
          }
          const state = stream._state;
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
          }
          if (state === "erroring") {
            return promiseRejectedWith(stream._storedError);
          }
          const promise = WritableStreamAddWriteRequest(stream);
          WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
          return promise;
        }
        const closeSentinel = {};
        class WritableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get abortReason() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("abortReason");
            }
            return this._abortReason;
          }
          get signal() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("signal");
            }
            if (this._abortController === void 0) {
              throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
            }
            return this._abortController.signal;
          }
          error(e2 = void 0) {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("error");
            }
            const state = this._controlledWritableStream._state;
            if (state !== "writable") {
              return;
            }
            WritableStreamDefaultControllerError(this, e2);
          }
          [AbortSteps](reason) {
            const result = this._abortAlgorithm(reason);
            WritableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }

          [ErrorSteps]() {
            ResetQueue(this);
          }
        }

        Object.defineProperties(WritableStreamDefaultController.prototype, {
          abortReason: { enumerable: true },
          signal: { enumerable: true },
          error: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultController",
            configurable: true
          });
        }

        function IsWritableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultController;
        }

        function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledWritableStream = stream;
          stream._writableStreamController = controller;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._abortReason = void 0;
          controller._abortController = createAbortController();
          controller._started = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._writeAlgorithm = writeAlgorithm;
          controller._closeAlgorithm = closeAlgorithm;
          controller._abortAlgorithm = abortAlgorithm;
          const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
          WritableStreamUpdateBackpressure(stream, backpressure);
          const startResult = startAlgorithm();
          const startPromise = promiseResolvedWith(startResult);
          uponPromise(startPromise, () => {
            controller._started = true;
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (r2) => {
            controller._started = true;
            WritableStreamDealWithRejection(stream, r2);
          });
        }

        function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(WritableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let writeAlgorithm = () => promiseResolvedWith(void 0);
          let closeAlgorithm = () => promiseResolvedWith(void 0);
          let abortAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSink.start !== void 0) {
            startAlgorithm = () => underlyingSink.start(controller);
          }
          if (underlyingSink.write !== void 0) {
            writeAlgorithm = (chunk) => underlyingSink.write(chunk, controller);
          }
          if (underlyingSink.close !== void 0) {
            closeAlgorithm = () => underlyingSink.close();
          }
          if (underlyingSink.abort !== void 0) {
            abortAlgorithm = (reason) => underlyingSink.abort(reason);
          }
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function WritableStreamDefaultControllerClearAlgorithms(controller) {
          controller._writeAlgorithm = void 0;
          controller._closeAlgorithm = void 0;
          controller._abortAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }

        function WritableStreamDefaultControllerClose(controller) {
          EnqueueValueWithSize(controller, closeSentinel, 0);
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }

        function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
          try {
            return controller._strategySizeAlgorithm(chunk);
          } catch (chunkSizeE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
            return 1;
          }
        }

        function WritableStreamDefaultControllerGetDesiredSize(controller) {
          return controller._strategyHWM - controller._queueTotalSize;
        }

        function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
          try {
            EnqueueValueWithSize(controller, chunk, chunkSize);
          } catch (enqueueE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
            return;
          }
          const stream = controller._controlledWritableStream;
          if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") {
            const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
            WritableStreamUpdateBackpressure(stream, backpressure);
          }
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }

        function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
          const stream = controller._controlledWritableStream;
          if (!controller._started) {
            return;
          }
          if (stream._inFlightWriteRequest !== void 0) {
            return;
          }
          const state = stream._state;
          if (state === "erroring") {
            WritableStreamFinishErroring(stream);
            return;
          }
          if (controller._queue.length === 0) {
            return;
          }
          const value = PeekQueueValue(controller);
          if (value === closeSentinel) {
            WritableStreamDefaultControllerProcessClose(controller);
          } else {
            WritableStreamDefaultControllerProcessWrite(controller, value);
          }
        }

        function WritableStreamDefaultControllerErrorIfNeeded(controller, error2) {
          if (controller._controlledWritableStream._state === "writable") {
            WritableStreamDefaultControllerError(controller, error2);
          }
        }

        function WritableStreamDefaultControllerProcessClose(controller) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkCloseRequestInFlight(stream);
          DequeueValue(controller);
          const sinkClosePromise = controller._closeAlgorithm();
          WritableStreamDefaultControllerClearAlgorithms(controller);
          uponPromise(sinkClosePromise, () => {
            WritableStreamFinishInFlightClose(stream);
          }, (reason) => {
            WritableStreamFinishInFlightCloseWithError(stream, reason);
          });
        }

        function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkFirstWriteRequestInFlight(stream);
          const sinkWritePromise = controller._writeAlgorithm(chunk);
          uponPromise(sinkWritePromise, () => {
            WritableStreamFinishInFlightWrite(stream);
            const state = stream._state;
            DequeueValue(controller);
            if (!WritableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
              const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
              WritableStreamUpdateBackpressure(stream, backpressure);
            }
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (reason) => {
            if (stream._state === "writable") {
              WritableStreamDefaultControllerClearAlgorithms(controller);
            }
            WritableStreamFinishInFlightWriteWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerGetBackpressure(controller) {
          const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
          return desiredSize <= 0;
        }
        function WritableStreamDefaultControllerError(controller, error2) {
          const stream = controller._controlledWritableStream;
          WritableStreamDefaultControllerClearAlgorithms(controller);
          WritableStreamStartErroring(stream, error2);
        }
        function streamBrandCheckException$2(name) {
          return new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
        }
        function defaultControllerBrandCheckException$2(name) {
          return new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
        }
        function defaultWriterBrandCheckException(name) {
          return new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
        }
        function defaultWriterLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released writer");
        }

        function defaultWriterClosedPromiseInitialize(writer) {
          writer._closedPromise = newPromise((resolve2, reject) => {
            writer._closedPromise_resolve = resolve2;
            writer._closedPromise_reject = reject;
            writer._closedPromiseState = "pending";
          });
        }

        function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseReject(writer, reason);
        }

        function defaultWriterClosedPromiseInitializeAsResolved(writer) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseResolve(writer);
        }
        function defaultWriterClosedPromiseReject(writer, reason) {
          if (writer._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._closedPromise);
          writer._closedPromise_reject(reason);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "rejected";
        }
        function defaultWriterClosedPromiseResetToRejected(writer, reason) {
          defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterClosedPromiseResolve(writer) {
          if (writer._closedPromise_resolve === void 0) {
            return;
          }
          writer._closedPromise_resolve(void 0);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "resolved";
        }
        function defaultWriterReadyPromiseInitialize(writer) {
          writer._readyPromise = newPromise((resolve2, reject) => {
            writer._readyPromise_resolve = resolve2;
            writer._readyPromise_reject = reject;
          });
          writer._readyPromiseState = "pending";
        }
        function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseReject(writer, reason);
        }
        function defaultWriterReadyPromiseInitializeAsResolved(writer) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseResolve(writer);
        }
        function defaultWriterReadyPromiseReject(writer, reason) {
          if (writer._readyPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._readyPromise);
          writer._readyPromise_reject(reason);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "rejected";
        }
        function defaultWriterReadyPromiseReset(writer) {
          defaultWriterReadyPromiseInitialize(writer);
        }
        function defaultWriterReadyPromiseResetToRejected(writer, reason) {
          defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterReadyPromiseResolve(writer) {
          if (writer._readyPromise_resolve === void 0) {
            return;
          }
          writer._readyPromise_resolve(void 0);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "fulfilled";
        }

        const NativeDOMException = typeof DOMException !== "undefined" ? DOMException : void 0;
        function isDOMExceptionConstructor(ctor) {
          if (!(typeof ctor === "function" || typeof ctor === "object")) {
            return false;
          }
          try {
            new ctor();
            return true;
          } catch (_a) {
            return false;
          }
        }
        function createDOMExceptionPolyfill() {
          const ctor = function DOMException2(message, name) {
            this.message = message || "";
            this.name = name || "Error";
            if (Error.captureStackTrace) {
              Error.captureStackTrace(this, this.constructor);
            }
          };
          ctor.prototype = Object.create(Error.prototype);
          Object.defineProperty(ctor.prototype, "constructor", { value: ctor, writable: true, configurable: true });
          return ctor;
        }

        const DOMException$1 = isDOMExceptionConstructor(NativeDOMException) ? NativeDOMException : createDOMExceptionPolyfill();

        function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
          const reader = AcquireReadableStreamDefaultReader(source);
          const writer = AcquireWritableStreamDefaultWriter(dest);
          source._disturbed = true;
          let shuttingDown = false;
          let currentWrite = promiseResolvedWith(void 0);
          return newPromise((resolve2, reject) => {
            let abortAlgorithm;
            if (signal !== void 0) {
              abortAlgorithm = () => {
                const error2 = new DOMException$1("Aborted", "AbortError");
                const actions = [];
                if (!preventAbort) {
                  actions.push(() => {
                    if (dest._state === "writable") {
                      return WritableStreamAbort(dest, error2);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                if (!preventCancel) {
                  actions.push(() => {
                    if (source._state === "readable") {
                      return ReadableStreamCancel(source, error2);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                shutdownWithAction(() => Promise.all(actions.map((action) => action())), true, error2);
              };
              if (signal.aborted) {
                abortAlgorithm();
                return;
              }
              signal.addEventListener("abort", abortAlgorithm);
            }
            function pipeLoop() {
              return newPromise((resolveLoop, rejectLoop) => {
                function next(done) {
                  if (done) {
                    resolveLoop();
                  } else {
                    PerformPromiseThen(pipeStep(), next, rejectLoop);
                  }
                }
                next(false);
              });
            }
            function pipeStep() {
              if (shuttingDown) {
                return promiseResolvedWith(true);
              }
              return PerformPromiseThen(writer._readyPromise, () => {
                return newPromise((resolveRead, rejectRead) => {
                  ReadableStreamDefaultReaderRead(reader, {
                    _chunkSteps: (chunk) => {
                      currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop4);
                      resolveRead(false);
                    },
                    _closeSteps: () => resolveRead(true),
                    _errorSteps: rejectRead
                  });
                });
              });
            }

            isOrBecomesErrored(source, reader._closedPromise, (storedError) => {
              if (!preventAbort) {
                shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesErrored(dest, writer._closedPromise, (storedError) => {
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesClosed(source, reader._closedPromise, () => {
              if (!preventClose) {
                shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
              } else {
                shutdown();
              }
            });
            if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
              const destClosed = new TypeError("the destination writable stream closed before all data could be piped to it");
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
              } else {
                shutdown(true, destClosed);
              }
            }
            setPromiseIsHandledToTrue(pipeLoop());

            function waitForWritesToFinish() {
              const oldCurrentWrite = currentWrite;
              return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0);
            }
            function isOrBecomesErrored(stream, promise, action) {
              if (stream._state === "errored") {
                action(stream._storedError);
              } else {
                uponRejection(promise, action);
              }
            }

            function isOrBecomesClosed(stream, promise, action) {
              if (stream._state === "closed") {
                action();
              } else {
                uponFulfillment(promise, action);
              }
            }

            function shutdownWithAction(action, originalIsError, originalError) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), doTheRest);
              } else {
                doTheRest();
              }

              function doTheRest() {
                uponPromise(action(), () => finalize(originalIsError, originalError), (newError) => finalize(true, newError));
              }
            }
            function shutdown(isError, error2) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error2));
              } else {
                finalize(isError, error2);
              }
            }
            function finalize(isError, error2) {
              WritableStreamDefaultWriterRelease(writer);
              ReadableStreamReaderGenericRelease(reader);
              if (signal !== void 0) {
                signal.removeEventListener("abort", abortAlgorithm);
              }
              if (isError) {
                reject(error2);
              } else {
                resolve2(void 0);
              }
            }
          });
        }
        class ReadableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("desiredSize");
            }
            return ReadableStreamDefaultControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("close");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits close");
            }
            ReadableStreamDefaultControllerClose(this);
          }
          enqueue(chunk = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("enqueue");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits enqueue");
            }
            return ReadableStreamDefaultControllerEnqueue(this, chunk);
          }
          error(e2 = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("error");
            }
            ReadableStreamDefaultControllerError(this, e2);
          }
          [CancelSteps](reason) {
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableStream;
            if (this._queue.length > 0) {
              const chunk = DequeueValue(this);
              if (this._closeRequested && this._queue.length === 0) {
                ReadableStreamDefaultControllerClearAlgorithms(this);
                ReadableStreamClose(stream);
              } else {
                ReadableStreamDefaultControllerCallPullIfNeeded(this);
              }
              readRequest._chunkSteps(chunk);
            } else {
              ReadableStreamAddReadRequest(stream, readRequest);
              ReadableStreamDefaultControllerCallPullIfNeeded(this);
            }
          }
        }

        Object.defineProperties(ReadableStreamDefaultController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultController",
            configurable: true
          });
        }

        function IsReadableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableStream")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultController;
        }
        function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableStreamDefaultControllerCallPullIfNeeded(controller);
            }
          }, (e2) => {
            ReadableStreamDefaultControllerError(controller, e2);
          });
        }
        function ReadableStreamDefaultControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableStream;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableStreamDefaultControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function ReadableStreamDefaultControllerClose(controller) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          controller._closeRequested = true;
          if (controller._queue.length === 0) {
            ReadableStreamDefaultControllerClearAlgorithms(controller);
            ReadableStreamClose(stream);
          }
        }
        function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            ReadableStreamFulfillReadRequest(stream, chunk, false);
          } else {
            let chunkSize;
            try {
              chunkSize = controller._strategySizeAlgorithm(chunk);
            } catch (chunkSizeE) {
              ReadableStreamDefaultControllerError(controller, chunkSizeE);
              throw chunkSizeE;
            }
            try {
              EnqueueValueWithSize(controller, chunk, chunkSize);
            } catch (enqueueE) {
              ReadableStreamDefaultControllerError(controller, enqueueE);
              throw enqueueE;
            }
          }
          ReadableStreamDefaultControllerCallPullIfNeeded(controller);
        }
        function ReadableStreamDefaultControllerError(controller, e2) {
          const stream = controller._controlledReadableStream;
          if (stream._state !== "readable") {
            return;
          }
          ResetQueue(controller);
          ReadableStreamDefaultControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
        }
        function ReadableStreamDefaultControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableStreamDefaultControllerHasBackpressure(controller) {
          if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
            return false;
          }
          return true;
        }

        function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
          const state = controller._controlledReadableStream._state;
          if (!controller._closeRequested && state === "readable") {
            return true;
          }
          return false;
        }

        function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledReadableStream = stream;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._started = false;
          controller._closeRequested = false;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          }, (r2) => {
            ReadableStreamDefaultControllerError(controller, r2);
          });
        }

        function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSource.start !== void 0) {
            startAlgorithm = () => underlyingSource.start(controller);
          }
          if (underlyingSource.pull !== void 0) {
            pullAlgorithm = () => underlyingSource.pull(controller);
          }
          if (underlyingSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingSource.cancel(reason);
          }
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function defaultControllerBrandCheckException$1(name) {
          return new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
        }
        function ReadableStreamTee(stream, cloneForBranch2) {
          if (IsReadableByteStreamController(stream._readableStreamController)) {
            return ReadableByteStreamTee(stream);
          }
          return ReadableStreamDefaultTee(stream);
        }
        function ReadableStreamDefaultTee(stream, cloneForBranch2) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgain = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve2) => {
            resolveCancelPromise = resolve2;
          });
          function pullAlgorithm() {
            if (reading) {
              readAgain = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgain = false;
                  const chunk1 = chunk;
                  const chunk2 = chunk;
                  if (!canceled1) {
                    ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgain) {
                    pullAlgorithm();
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableStreamDefaultControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableStreamDefaultControllerClose(branch2._readableStreamController);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }

          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }

          function startAlgorithm() {
          }

          branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
          branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
          uponRejection(reader._closedPromise, (r2) => {
            ReadableStreamDefaultControllerError(branch1._readableStreamController, r2);
            ReadableStreamDefaultControllerError(branch2._readableStreamController, r2);
            if (!canceled1 || !canceled2) {
              resolveCancelPromise(void 0);
            }
          });
          return [branch1, branch2];
        }
        function ReadableByteStreamTee(stream) {
          let reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgainForBranch1 = false;
          let readAgainForBranch2 = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve2) => {
            resolveCancelPromise = resolve2;
          });
          function forwardReaderError(thisReader) {
            uponRejection(thisReader._closedPromise, (r2) => {
              if (thisReader !== reader) {
                return;
              }
              ReadableByteStreamControllerError(branch1._readableStreamController, r2);
              ReadableByteStreamControllerError(branch2._readableStreamController, r2);
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            });
          }
          function pullWithDefaultReader() {
            if (IsReadableStreamBYOBReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamDefaultReader(stream);
              forwardReaderError(reader);
            }
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
                  const chunk1 = chunk;
                  let chunk2 = chunk;
                  if (!canceled1 && !canceled2) {
                    try {
                      chunk2 = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                  }
                  if (!canceled1) {
                    ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableByteStreamControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableByteStreamControllerClose(branch2._readableStreamController);
                }
                if (branch1._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
                }
                if (branch2._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
          }
          function pullWithBYOBReader(view, forBranch2) {
            if (IsReadableStreamDefaultReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamBYOBReader(stream);
              forwardReaderError(reader);
            }
            const byobBranch = forBranch2 ? branch2 : branch1;
            const otherBranch = forBranch2 ? branch1 : branch2;
            const readIntoRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
                  const byobCanceled = forBranch2 ? canceled2 : canceled1;
                  const otherCanceled = forBranch2 ? canceled1 : canceled2;
                  if (!otherCanceled) {
                    let clonedChunk;
                    try {
                      clonedChunk = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                    if (!byobCanceled) {
                      ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                    }
                    ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
                  } else if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
                  }
                });
              },
              _closeSteps: (chunk) => {
                reading = false;
                const byobCanceled = forBranch2 ? canceled2 : canceled1;
                const otherCanceled = forBranch2 ? canceled1 : canceled2;
                if (!byobCanceled) {
                  ReadableByteStreamControllerClose(byobBranch._readableStreamController);
                }
                if (!otherCanceled) {
                  ReadableByteStreamControllerClose(otherBranch._readableStreamController);
                }
                if (chunk !== void 0) {
                  if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
                    ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
                  }
                }
                if (!byobCanceled || !otherCanceled) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamBYOBReaderRead(reader, view, readIntoRequest);
          }
          function pull1Algorithm() {
            if (reading) {
              readAgainForBranch1 = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, false);
            }
            return promiseResolvedWith(void 0);
          }
          function pull2Algorithm() {
            if (reading) {
              readAgainForBranch2 = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, true);
            }
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }

          function startAlgorithm() {
            return;
          }

          branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
          branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
          forwardReaderError(reader);
          return [branch1, branch2];
        }
        function convertUnderlyingDefaultOrByteSource(source, context) {
          assertDictionary(source, context);
          const original = source;
          const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
          const cancel = original === null || original === void 0 ? void 0 : original.cancel;
          const pull = original === null || original === void 0 ? void 0 : original.pull;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          return {
            autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
            cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
            pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
            type: type === void 0 ? void 0 : convertReadableStreamType(type, `${context} has member 'type' that`)
          };
        }
        function convertUnderlyingSourceCancelCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSourcePullCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertUnderlyingSourceStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertReadableStreamType(type, context) {
          type = `${type}`;
          if (type !== "bytes") {
            throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
          }
          return type;
        }
        function convertReaderOptions(options, context) {
          assertDictionary(options, context);
          const mode = options === null || options === void 0 ? void 0 : options.mode;
          return {
            mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
          };
        }
        function convertReadableStreamReaderMode(mode, context) {
          mode = `${mode}`;
          if (mode !== "byob") {
            throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
          }
          return mode;
        }
        function convertIteratorOptions(options, context) {
          assertDictionary(options, context);
          const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
          return { preventCancel: Boolean(preventCancel) };
        }
        function convertPipeOptions(options, context) {
          assertDictionary(options, context);
          const preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
          const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
          const preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
          const signal = options === null || options === void 0 ? void 0 : options.signal;
          if (signal !== void 0) {
            assertAbortSignal(signal, `${context} has member 'signal' that`);
          }
          return {
            preventAbort: Boolean(preventAbort),
            preventCancel: Boolean(preventCancel),
            preventClose: Boolean(preventClose),
            signal
          };
        }
        function assertAbortSignal(signal, context) {
          if (!isAbortSignal2(signal)) {
            throw new TypeError(`${context} is not an AbortSignal.`);
          }
        }
        function convertReadableWritablePair(pair, context) {
          assertDictionary(pair, context);
          const readable2 = pair === null || pair === void 0 ? void 0 : pair.readable;
          assertRequiredField(readable2, "readable", "ReadableWritablePair");
          assertReadableStream(readable2, `${context} has member 'readable' that`);
          const writable3 = pair === null || pair === void 0 ? void 0 : pair.writable;
          assertRequiredField(writable3, "writable", "ReadableWritablePair");
          assertWritableStream(writable3, `${context} has member 'writable' that`);
          return { readable: readable2, writable: writable3 };
        }
        class ReadableStream2 {
          constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
            if (rawUnderlyingSource === void 0) {
              rawUnderlyingSource = null;
            } else {
              assertObject(rawUnderlyingSource, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
            InitializeReadableStream(this);
            if (underlyingSource.type === "bytes") {
              if (strategy.size !== void 0) {
                throw new RangeError("The strategy for a byte stream cannot have a size function");
              }
              const highWaterMark = ExtractHighWaterMark(strategy, 0);
              SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
            } else {
              const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
              const highWaterMark = ExtractHighWaterMark(strategy, 1);
              SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
            }
          }
          get locked() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("locked");
            }
            return IsReadableStreamLocked(this);
          }
          cancel(reason = void 0) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("cancel"));
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot cancel a stream that already has a reader"));
            }
            return ReadableStreamCancel(this, reason);
          }
          getReader(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("getReader");
            }
            const options = convertReaderOptions(rawOptions, "First parameter");
            if (options.mode === void 0) {
              return AcquireReadableStreamDefaultReader(this);
            }
            return AcquireReadableStreamBYOBReader(this);
          }
          pipeThrough(rawTransform, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("pipeThrough");
            }
            assertRequiredArgument(rawTransform, 1, "pipeThrough");
            const transform = convertReadableWritablePair(rawTransform, "First parameter");
            const options = convertPipeOptions(rawOptions, "Second parameter");
            if (IsReadableStreamLocked(this)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
            }
            if (IsWritableStreamLocked(transform.writable)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
            }
            const promise = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
            setPromiseIsHandledToTrue(promise);
            return transform.readable;
          }
          pipeTo(destination, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
            }
            if (destination === void 0) {
              return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
            }
            if (!IsWritableStream(destination)) {
              return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
            }
            let options;
            try {
              options = convertPipeOptions(rawOptions, "Second parameter");
            } catch (e2) {
              return promiseRejectedWith(e2);
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
            }
            if (IsWritableStreamLocked(destination)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
            }
            return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
          }
          tee() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("tee");
            }
            const branches = ReadableStreamTee(this);
            return CreateArrayFromList(branches);
          }
          values(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("values");
            }
            const options = convertIteratorOptions(rawOptions, "First parameter");
            return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
          }
        }

        Object.defineProperties(ReadableStream2.prototype, {
          cancel: { enumerable: true },
          getReader: { enumerable: true },
          pipeThrough: { enumerable: true },
          pipeTo: { enumerable: true },
          tee: { enumerable: true },
          values: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStream",
            configurable: true
          });
        }
        if (typeof SymbolPolyfill.asyncIterator === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.asyncIterator, {
            value: ReadableStream2.prototype.values,
            writable: true,
            configurable: true
          });
        }

        function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }

        function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableByteStreamController.prototype);
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
          return stream;
        }

        function InitializeReadableStream(stream) {
          stream._state = "readable";
          stream._reader = void 0;
          stream._storedError = void 0;
          stream._disturbed = false;
        }
        function IsReadableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readableStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStream2;
        }
        function IsReadableStreamLocked(stream) {
          if (stream._reader === void 0) {
            return false;
          }
          return true;
        }
        function ReadableStreamCancel(stream, reason) {
          stream._disturbed = true;
          if (stream._state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (stream._state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          ReadableStreamClose(stream);
          const reader = stream._reader;
          if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._closeSteps(void 0);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
          const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
          return transformPromiseWith(sourceCancelPromise, noop4);
        }
        function ReadableStreamClose(stream) {
          stream._state = "closed";
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseResolve(reader);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._closeSteps();
            });
            reader._readRequests = new SimpleQueue();
          }
        }
        function ReadableStreamError(stream, e2) {
          stream._state = "errored";
          stream._storedError = e2;
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseReject(reader, e2);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._errorSteps(e2);
            });
            reader._readRequests = new SimpleQueue();
          } else {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._errorSteps(e2);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
        }
        function streamBrandCheckException$1(name) {
          return new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
        }
        function convertQueuingStrategyInit(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
          return {
            highWaterMark: convertUnrestrictedDouble(highWaterMark)
          };
        }

        const byteLengthSizeFunction = (chunk) => {
          return chunk.byteLength;
        };
        try {
          Object.defineProperty(byteLengthSizeFunction, "name", {
            value: "size",
            configurable: true
          });
        } catch (_a) {
        }
        class ByteLengthQueuingStrategy {
          constructor(options) {
            assertRequiredArgument(options, 1, "ByteLengthQueuingStrategy");
            options = convertQueuingStrategyInit(options, "First parameter");
            this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
          }
          get highWaterMark() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("highWaterMark");
            }
            return this._byteLengthQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("size");
            }
            return byteLengthSizeFunction;
          }
        }

        Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ByteLengthQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "ByteLengthQueuingStrategy",
            configurable: true
          });
        }

        function byteLengthBrandCheckException(name) {
          return new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
        }

        function IsByteLengthQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_byteLengthQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof ByteLengthQueuingStrategy;
        }
        const countSizeFunction = () => {
          return 1;
        };
        try {
          Object.defineProperty(countSizeFunction, "name", {
            value: "size",
            configurable: true
          });
        } catch (_a) {
        }
        class CountQueuingStrategy {
          constructor(options) {
            assertRequiredArgument(options, 1, "CountQueuingStrategy");
            options = convertQueuingStrategyInit(options, "First parameter");
            this._countQueuingStrategyHighWaterMark = options.highWaterMark;
          }
          get highWaterMark() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("highWaterMark");
            }
            return this._countQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("size");
            }
            return countSizeFunction;
          }
        }

        Object.defineProperties(CountQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(CountQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "CountQueuingStrategy",
            configurable: true
          });
        }

        function countBrandCheckException(name) {
          return new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
        }

        function IsCountQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_countQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof CountQueuingStrategy;
        }
        function convertTransformer(original, context) {
          assertDictionary(original, context);
          const flush = original === null || original === void 0 ? void 0 : original.flush;
          const readableType = original === null || original === void 0 ? void 0 : original.readableType;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const transform = original === null || original === void 0 ? void 0 : original.transform;
          const writableType = original === null || original === void 0 ? void 0 : original.writableType;
          return {
            flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
            readableType,
            start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
            transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
            writableType
          };
        }
        function convertTransformerFlushCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertTransformerStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertTransformerTransformCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        class TransformStream {
          constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
            if (rawTransformer === void 0) {
              rawTransformer = null;
            }
            const writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
            const readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
            const transformer = convertTransformer(rawTransformer, "First parameter");
            if (transformer.readableType !== void 0) {
              throw new RangeError("Invalid readableType specified");
            }
            if (transformer.writableType !== void 0) {
              throw new RangeError("Invalid writableType specified");
            }
            const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
            const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
            const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
            const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
            let startPromise_resolve;
            const startPromise = newPromise((resolve2) => {
              startPromise_resolve = resolve2;
            });
            InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
            SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
            if (transformer.start !== void 0) {
              startPromise_resolve(transformer.start(this._transformStreamController));
            } else {
              startPromise_resolve(void 0);
            }
          }
          get readable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("readable");
            }
            return this._readable;
          }
          get writable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("writable");
            }
            return this._writable;
          }
        }

        Object.defineProperties(TransformStream.prototype, {
          readable: { enumerable: true },
          writable: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStream.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStream",
            configurable: true
          });
        }

        function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
          function startAlgorithm() {
            return startPromise;
          }

          function writeAlgorithm(chunk) {
            return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
          }

          function abortAlgorithm(reason) {
            return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
          }

          function closeAlgorithm() {
            return TransformStreamDefaultSinkCloseAlgorithm(stream);
          }

          stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
          function pullAlgorithm() {
            return TransformStreamDefaultSourcePullAlgorithm(stream);
          }
          function cancelAlgorithm(reason) {
            TransformStreamErrorWritableAndUnblockWrite(stream, reason);
            return promiseResolvedWith(void 0);
          }

          stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
          stream._backpressure = void 0;
          stream._backpressureChangePromise = void 0;
          stream._backpressureChangePromise_resolve = void 0;
          TransformStreamSetBackpressure(stream, true);
          stream._transformStreamController = void 0;
        }
        function IsTransformStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_transformStreamController")) {
            return false;
          }
          return x2 instanceof TransformStream;
        }
        function TransformStreamError(stream, e2) {
          ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e2);
          TransformStreamErrorWritableAndUnblockWrite(stream, e2);
        }
        function TransformStreamErrorWritableAndUnblockWrite(stream, e2) {
          TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
          WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e2);
          if (stream._backpressure) {
            TransformStreamSetBackpressure(stream, false);
          }
        }
        function TransformStreamSetBackpressure(stream, backpressure) {
          if (stream._backpressureChangePromise !== void 0) {
            stream._backpressureChangePromise_resolve();
          }
          stream._backpressureChangePromise = newPromise((resolve2) => {
            stream._backpressureChangePromise_resolve = resolve2;
          });
          stream._backpressure = backpressure;
        }
        class TransformStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("desiredSize");
            }
            const readableController = this._controlledTransformStream._readable._readableStreamController;
            return ReadableStreamDefaultControllerGetDesiredSize(readableController);
          }
          enqueue(chunk = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("enqueue");
            }
            TransformStreamDefaultControllerEnqueue(this, chunk);
          }
          error(reason = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("error");
            }
            TransformStreamDefaultControllerError(this, reason);
          }
          terminate() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("terminate");
            }
            TransformStreamDefaultControllerTerminate(this);
          }
        }

        Object.defineProperties(TransformStreamDefaultController.prototype, {
          enqueue: { enumerable: true },
          error: { enumerable: true },
          terminate: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStreamDefaultController",
            configurable: true
          });
        }

        function IsTransformStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledTransformStream")) {
            return false;
          }
          return x2 instanceof TransformStreamDefaultController;
        }

        function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
          controller._controlledTransformStream = stream;
          stream._transformStreamController = controller;
          controller._transformAlgorithm = transformAlgorithm;
          controller._flushAlgorithm = flushAlgorithm;
        }

        function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
          const controller = Object.create(TransformStreamDefaultController.prototype);
          let transformAlgorithm = (chunk) => {
            try {
              TransformStreamDefaultControllerEnqueue(controller, chunk);
              return promiseResolvedWith(void 0);
            } catch (transformResultE) {
              return promiseRejectedWith(transformResultE);
            }
          };
          let flushAlgorithm = () => promiseResolvedWith(void 0);
          if (transformer.transform !== void 0) {
            transformAlgorithm = (chunk) => transformer.transform(chunk, controller);
          }
          if (transformer.flush !== void 0) {
            flushAlgorithm = () => transformer.flush(controller);
          }
          SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
        }
        function TransformStreamDefaultControllerClearAlgorithms(controller) {
          controller._transformAlgorithm = void 0;
          controller._flushAlgorithm = void 0;
        }
        function TransformStreamDefaultControllerEnqueue(controller, chunk) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
            throw new TypeError("Readable side is not in a state that permits enqueue");
          }
          try {
            ReadableStreamDefaultControllerEnqueue(readableController, chunk);
          } catch (e2) {
            TransformStreamErrorWritableAndUnblockWrite(stream, e2);
            throw stream._readable._storedError;
          }
          const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
          if (backpressure !== stream._backpressure) {
            TransformStreamSetBackpressure(stream, true);
          }
        }

        function TransformStreamDefaultControllerError(controller, e2) {
          TransformStreamError(controller._controlledTransformStream, e2);
        }

        function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
          const transformPromise = controller._transformAlgorithm(chunk);
          return transformPromiseWith(transformPromise, void 0, (r2) => {
            TransformStreamError(controller._controlledTransformStream, r2);
            throw r2;
          });
        }

        function TransformStreamDefaultControllerTerminate(controller) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          ReadableStreamDefaultControllerClose(readableController);
          const error2 = new TypeError("TransformStream terminated");
          TransformStreamErrorWritableAndUnblockWrite(stream, error2);
        }
        function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
          const controller = stream._transformStreamController;
          if (stream._backpressure) {
            const backpressureChangePromise = stream._backpressureChangePromise;
            return transformPromiseWith(backpressureChangePromise, () => {
              const writable3 = stream._writable;
              const state = writable3._state;
              if (state === "erroring") {
                throw writable3._storedError;
              }
              return TransformStreamDefaultControllerPerformTransform(controller, chunk);
            });
          }
          return TransformStreamDefaultControllerPerformTransform(controller, chunk);
        }
        function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
          TransformStreamError(stream, reason);
          return promiseResolvedWith(void 0);
        }
        function TransformStreamDefaultSinkCloseAlgorithm(stream) {
          const readable2 = stream._readable;
          const controller = stream._transformStreamController;
          const flushPromise = controller._flushAlgorithm();
          TransformStreamDefaultControllerClearAlgorithms(controller);
          return transformPromiseWith(flushPromise, () => {
            if (readable2._state === "errored") {
              throw readable2._storedError;
            }
            ReadableStreamDefaultControllerClose(readable2._readableStreamController);
          }, (r2) => {
            TransformStreamError(stream, r2);
            throw readable2._storedError;
          });
        }
        function TransformStreamDefaultSourcePullAlgorithm(stream) {
          TransformStreamSetBackpressure(stream, false);
          return stream._backpressureChangePromise;
        }
        function defaultControllerBrandCheckException(name) {
          return new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
        }
        function streamBrandCheckException(name) {
          return new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
        }
        exports2.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
        exports2.CountQueuingStrategy = CountQueuingStrategy;
        exports2.ReadableByteStreamController = ReadableByteStreamController;
        exports2.ReadableStream = ReadableStream2;
        exports2.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
        exports2.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
        exports2.ReadableStreamDefaultController = ReadableStreamDefaultController;
        exports2.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
        exports2.TransformStream = TransformStream;
        exports2.TransformStreamDefaultController = TransformStreamDefaultController;
        exports2.WritableStream = WritableStream;
        exports2.WritableStreamDefaultController = WritableStreamDefaultController;
        exports2.WritableStreamDefaultWriter = WritableStreamDefaultWriter;
        Object.defineProperty(exports2, "__esModule", { value: true });
      });
    })(ponyfill_es2018, ponyfill_es2018.exports);
    POOL_SIZE$1 = 65536;
    if (!globalThis.ReadableStream) {
      try {
        const process2 = require("node:process");
        const { emitWarning } = process2;
        try {
          process2.emitWarning = () => {
          };
          Object.assign(globalThis, require("node:stream/web"));
          process2.emitWarning = emitWarning;
        } catch (error2) {
          process2.emitWarning = emitWarning;
          throw error2;
        }
      } catch (error2) {
        Object.assign(globalThis, ponyfill_es2018.exports);
      }
    }
    try {
      const { Blob: Blob3 } = require("buffer");
      if (Blob3 && !Blob3.prototype.stream) {
        Blob3.prototype.stream = function name(params) {
          let position = 0;
          const blob = this;
          return new ReadableStream({
            type: "bytes",
            async pull(ctrl) {
              const chunk = blob.slice(position, Math.min(blob.size, position + POOL_SIZE$1));
              const buffer = await chunk.arrayBuffer();
              position += buffer.byteLength;
              ctrl.enqueue(new Uint8Array(buffer));
              if (position === blob.size) {
                ctrl.close();
              }
            }
          });
        };
      }
    } catch (error2) {
    }
    POOL_SIZE = 65536;
    _Blob = class Blob {
      #parts = [];
      #type = "";
      #size = 0;
      #endings = "transparent";
      constructor(blobParts = [], options = {}) {
        if (typeof blobParts !== "object" || blobParts === null) {
          throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
        }
        if (typeof blobParts[Symbol.iterator] !== "function") {
          throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
        }
        if (typeof options !== "object" && typeof options !== "function") {
          throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
        }
        if (options === null)
          options = {};
        const encoder2 = new TextEncoder();
        for (const element of blobParts) {
          let part;
          if (ArrayBuffer.isView(element)) {
            part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
          } else if (element instanceof ArrayBuffer) {
            part = new Uint8Array(element.slice(0));
          } else if (element instanceof Blob) {
            part = element;
          } else {
            part = encoder2.encode(`${element}`);
          }
          const size = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (size) {
            this.#size += size;
            this.#parts.push(part);
          }
        }
        this.#endings = `${options.endings === void 0 ? "transparent" : options.endings}`;
        const type = options.type === void 0 ? "" : String(options.type);
        this.#type = /^[\x20-\x7E]*$/.test(type) ? type : "";
      }
      get size() {
        return this.#size;
      }
      get type() {
        return this.#type;
      }
      async text() {
        const decoder = new TextDecoder();
        let str = "";
        for await (const part of toIterator(this.#parts, false)) {
          str += decoder.decode(part, { stream: true });
        }
        str += decoder.decode();
        return str;
      }
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(this.#parts, false)) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        const it = toIterator(this.#parts, true);
        return new globalThis.ReadableStream({
          type: "bytes",
          async pull(ctrl) {
            const chunk = await it.next();
            chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
          },
          async cancel() {
            await it.return();
          }
        });
      }

      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = this.#parts;
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          if (added >= span) {
            break;
          }
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            let chunk;
            if (ArrayBuffer.isView(part)) {
              chunk = part.subarray(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.byteLength;
            } else {
              chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.size;
            }
            relativeEnd -= size2;
            blobParts.push(chunk);
            relativeStart = 0;
          }
        }
        const blob = new Blob([], { type: String(type).toLowerCase() });
        blob.#size = span;
        blob.#parts = blobParts;
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    };
    Object.defineProperties(_Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Blob2 = _Blob;
    Blob$1 = Blob2;
    _File = class File2 extends Blob$1 {
      #lastModified = 0;
      #name = "";
      constructor(fileBits, fileName, options = {}) {
        if (arguments.length < 2) {
          throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
        }
        super(fileBits, options);
        if (options === null)
          options = {};
        const lastModified = options.lastModified === void 0 ? Date.now() : Number(options.lastModified);
        if (!Number.isNaN(lastModified)) {
          this.#lastModified = lastModified;
        }
        this.#name = String(fileName);
      }
      get name() {
        return this.#name;
      }
      get lastModified() {
        return this.#lastModified;
      }

      get [Symbol.toStringTag]() {
        return "File";
      }

      static [Symbol.hasInstance](object) {
        return !!object && object instanceof Blob$1 && /^(File)$/.test(object[Symbol.toStringTag]);
      }
    };
    File = _File;
    ({ toStringTag: t, iterator: i, hasInstance: h } = Symbol);
    r = Math.random;
    m = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(",");
    f2 = (a, b, c) => (a += "", /^(Blob|File)$/.test(b && b[t]) ? [(c = c !== void 0 ? c + "" : b[t] == "File" ? b.name : "blob", a), b.name !== c || b[t] == "blob" ? new File([b], c, b) : b] : [a, b + ""]);
    e = (c, f3) => (f3 ? c : c.replace(/\r?\n|\r/g, "\r\n")).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22");
    x = (n, a, e2) => {
      if (a.length < e2) {
        throw new TypeError(`Failed to execute '${n}' on 'FormData': ${e2} arguments required, but only ${a.length} present.`);
      }
    };
    FormData = class FormData2 {
      #d = [];

      constructor(...a) {
        if (a.length)
          throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`);
      }
      get [t]() {
        return "FormData";
      }
      [i]() {
        return this.entries();
      }
      static [h](o) {
        return o && typeof o === "object" && o[t] === "FormData" && !m.some((m2) => typeof o[m2] != "function");
      }
      append(...a) {
        x("append", arguments, 2);
        this.#d.push(f2(...a));
      }
      delete(a) {
        x("delete", arguments, 1);
        a += "";
        this.#d = this.#d.filter(([b]) => b !== a);
      }
      get(a) {
        x("get", arguments, 1);
        a += "";
        for (var b = this.#d, l = b.length, c = 0; c < l; c++)
          if (b[c][0] === a)
            return b[c][1];
        return null;
      }
      getAll(a, b) {
        x("getAll", arguments, 1);
        b = [];
        a += "";
        this.#d.forEach((c) => c[0] === a && b.push(c[1]));
        return b;
      }
      has(a) {
        x("has", arguments, 1);
        a += "";
        return this.#d.some((b) => b[0] === a);
      }
      forEach(a, b) {
        x("forEach", arguments, 1);
        for (var [c, d] of this)
          a.call(b, d, c, this);
      }
      set(...a) {
        x("set", arguments, 2);
        var b = [], c = true;
        a = f2(...a);
        this.#d.forEach((d) => {
          d[0] === a[0] ? c && (c = !b.push(a)) : b.push(d);
        });
        c && b.push(a);
        this.#d = b;
      }
      *entries() {
        yield* this.#d;
      }
      *keys() {
        for (var [a] of this)
          yield a;
      }
      *values() {
        for (var [, a] of this)
          yield a;
      }
    };
    FetchBaseError = class extends Error {
      constructor(message, type) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.type = type;
      }
      get name() {
        return this.constructor.name;
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
    };
    FetchError = class extends FetchBaseError {
      constructor(message, type, systemError) {
        super(message, type);
        if (systemError) {
          this.code = this.errno = systemError.code;
          this.erroredSysCall = systemError.syscall;
        }
      }
    };
    NAME = Symbol.toStringTag;
    isURLSearchParameters = (object) => {
      return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
    };
    isBlob = (object) => {
      return object && typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
    };
    isAbortSignal = (object) => {
      return typeof object === "object" && (object[NAME] === "AbortSignal" || object[NAME] === "EventTarget");
    };
    isDomainOrSubdomain = (destination, original) => {
      const orig = new URL(original).hostname;
      const dest = new URL(destination).hostname;
      return orig === dest || orig.endsWith(`.${dest}`);
    };
    pipeline = (0, import_node_util.promisify)(import_node_stream.default.pipeline);
    INTERNALS$2 = Symbol("Body internals");
    Body = class {
      constructor(body, {
        size = 0
      } = {}) {
        let boundary = null;
        if (body === null) {
          body = null;
        } else if (isURLSearchParameters(body)) {
          body = import_node_buffer.Buffer.from(body.toString());
        } else if (isBlob(body))
          ;
        else if (import_node_buffer.Buffer.isBuffer(body))
          ;
        else if (import_node_util.types.isAnyArrayBuffer(body)) {
          body = import_node_buffer.Buffer.from(body);
        } else if (ArrayBuffer.isView(body)) {
          body = import_node_buffer.Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        } else if (body instanceof import_node_stream.default)
          ;
        else if (body instanceof FormData) {
          body = formDataToBlob(body);
          boundary = body.type.split("=")[1];
        } else {
          body = import_node_buffer.Buffer.from(String(body));
        }
        let stream = body;
        if (import_node_buffer.Buffer.isBuffer(body)) {
          stream = import_node_stream.default.Readable.from(body);
        } else if (isBlob(body)) {
          stream = import_node_stream.default.Readable.from(body.stream());
        }
        this[INTERNALS$2] = {
          body,
          stream,
          boundary,
          disturbed: false,
          error: null
        };
        this.size = size;
        if (body instanceof import_node_stream.default) {
          body.on("error", (error_) => {
            const error2 = error_ instanceof FetchBaseError ? error_ : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, "system", error_);
            this[INTERNALS$2].error = error2;
          });
        }
      }
      get body() {
        return this[INTERNALS$2].stream;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer, byteOffset, byteLength } = await consumeBody(this);
        return buffer.slice(byteOffset, byteOffset + byteLength);
      }
      async formData() {
        const ct = this.headers.get("content-type");
        if (ct.startsWith("application/x-www-form-urlencoded")) {
          const formData = new FormData();
          const parameters = new URLSearchParams(await this.text());
          for (const [name, value] of parameters) {
            formData.append(name, value);
          }
          return formData;
        }
        const { toFormData: toFormData2 } = await Promise.resolve().then(() => (init_multipart_parser(), multipart_parser_exports));
        return toFormData2(this.body, ct);
      }
      async blob() {
        const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
        const buf = await this.arrayBuffer();
        return new Blob$1([buf], {
          type: ct
        });
      }
      async json() {
        const text = await this.text();
        return JSON.parse(text);
      }

      async text() {
        const buffer = await consumeBody(this);
        return new TextDecoder().decode(buffer);
      }

      buffer() {
        return consumeBody(this);
      }
    };
    Body.prototype.buffer = (0, import_node_util.deprecate)(Body.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true },
      data: {
        get: (0, import_node_util.deprecate)(() => {
        }, "data doesn't exist, use json(), text(), arrayBuffer(), or body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (response)")
      }
    });
    clone = (instance, highWaterMark) => {
      let p1;
      let p2;
      let { body } = instance[INTERNALS$2];
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof import_node_stream.default && typeof body.getBoundary !== "function") {
        p1 = new import_node_stream.PassThrough({ highWaterMark });
        p2 = new import_node_stream.PassThrough({ highWaterMark });
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS$2].stream = p1;
        body = p2;
      }
      return body;
    };
    getNonSpecFormDataBoundary = (0, import_node_util.deprecate)((body) => body.getBoundary(), "form-data doesn't follow the spec and requires special treatment. Use alternative package", "https://github.com/node-fetch/node-fetch/issues/1167");
    extractContentType = (body, request) => {
      if (body === null) {
        return null;
      }
      if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      }
      if (isURLSearchParameters(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      }
      if (isBlob(body)) {
        return body.type || null;
      }
      if (import_node_buffer.Buffer.isBuffer(body) || import_node_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
        return null;
      }
      if (body instanceof FormData) {
        return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
      }
      if (body && typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${getNonSpecFormDataBoundary(body)}`;
      }
      if (body instanceof import_node_stream.default) {
        return null;
      }
      return "text/plain;charset=UTF-8";
    };
    getTotalBytes = (request) => {
      const { body } = request[INTERNALS$2];
      if (body === null) {
        return 0;
      }
      if (isBlob(body)) {
        return body.size;
      }
      if (import_node_buffer.Buffer.isBuffer(body)) {
        return body.length;
      }
      if (body && typeof body.getLengthSync === "function") {
        return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
      }
      return null;
    };
    writeToStream = async (dest, { body }) => {
      if (body === null) {
        dest.end();
      } else {
        await pipeline(body, dest);
      }
    };
    validateHeaderName = typeof import_node_http.default.validateHeaderName === "function" ? import_node_http.default.validateHeaderName : (name) => {
      if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
        const error2 = new TypeError(`Header name must be a valid HTTP token [${name}]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
        throw error2;
      }
    };
    validateHeaderValue = typeof import_node_http.default.validateHeaderValue === "function" ? import_node_http.default.validateHeaderValue : (name, value) => {
      if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
        const error2 = new TypeError(`Invalid character in header content ["${name}"]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_CHAR" });
        throw error2;
      }
    };
    Headers2 = class extends URLSearchParams {
      constructor(init2) {
        let result = [];
        if (init2 instanceof Headers2) {
          const raw = init2.raw();
          for (const [name, values] of Object.entries(raw)) {
            result.push(...values.map((value) => [name, value]));
          }
        } else if (init2 == null)
          ;
        else if (typeof init2 === "object" && !import_node_util.types.isBoxedPrimitive(init2)) {
          const method = init2[Symbol.iterator];
          if (method == null) {
            result.push(...Object.entries(init2));
          } else {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            result = [...init2].map((pair) => {
              if (typeof pair !== "object" || import_node_util.types.isBoxedPrimitive(pair)) {
                throw new TypeError("Each header pair must be an iterable object");
              }
              return [...pair];
            }).map((pair) => {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              return [...pair];
            });
          }
        } else {
          throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
        }
        result = result.length > 0 ? result.map(([name, value]) => {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return [String(name).toLowerCase(), String(value)];
        }) : void 0;
        super(result);
        return new Proxy(this, {
          get(target, p, receiver) {
            switch (p) {
              case "append":
              case "set":
                return (name, value) => {
                  validateHeaderName(name);
                  validateHeaderValue(name, String(value));
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase(), String(value));
                };
              case "delete":
              case "has":
              case "getAll":
                return (name) => {
                  validateHeaderName(name);
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase());
                };
              case "keys":
                return () => {
                  target.sort();
                  return new Set(URLSearchParams.prototype.keys.call(target)).keys();
                };
              default:
                return Reflect.get(target, p, receiver);
            }
          }
        });
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
      toString() {
        return Object.prototype.toString.call(this);
      }
      get(name) {
        const values = this.getAll(name);
        if (values.length === 0) {
          return null;
        }
        let value = values.join(", ");
        if (/^content-encoding$/i.test(name)) {
          value = value.toLowerCase();
        }
        return value;
      }
      forEach(callback, thisArg = void 0) {
        for (const name of this.keys()) {
          Reflect.apply(callback, thisArg, [this.get(name), name, this]);
        }
      }
      *values() {
        for (const name of this.keys()) {
          yield this.get(name);
        }
      }
      *entries() {
        for (const name of this.keys()) {
          yield [name, this.get(name)];
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }

      raw() {
        return [...this.keys()].reduce((result, key2) => {
          result[key2] = this.getAll(key2);
          return result;
        }, {});
      }

      [Symbol.for("nodejs.util.inspect.custom")]() {
        return [...this.keys()].reduce((result, key2) => {
          const values = this.getAll(key2);
          if (key2 === "host") {
            result[key2] = values[0];
          } else {
            result[key2] = values.length > 1 ? values : values[0];
          }
          return result;
        }, {});
      }
    };
    Object.defineProperties(Headers2.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
      result[property] = { enumerable: true };
      return result;
    }, {}));
    redirectStatus = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
    isRedirect = (code) => {
      return redirectStatus.has(code);
    };
    INTERNALS$1 = Symbol("Response internals");
    Response2 = class extends Body {
      constructor(body = null, options = {}) {
        super(body, options);
        const status = options.status != null ? options.status : 200;
        const headers = new Headers2(options.headers);
        if (body !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body, this);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          type: "default",
          url: options.url,
          status,
          statusText: options.statusText || "",
          headers,
          counter: options.counter,
          highWaterMark: options.highWaterMark
        };
      }
      get type() {
        return this[INTERNALS$1].type;
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      get highWaterMark() {
        return this[INTERNALS$1].highWaterMark;
      }
      clone() {
        return new Response2(clone(this, this.highWaterMark), {
          type: this.type,
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected,
          size: this.size,
          highWaterMark: this.highWaterMark
        });
      }
      static redirect(url, status = 302) {
        if (!isRedirect(status)) {
          throw new RangeError("Failed to execute \"redirect\" on \"response\": Invalid status code");
        }
        return new Response2(null, {
          headers: {
            location: new URL(url).toString()
          },
          status
        });
      }
      static error() {
        const response = new Response2(null, { status: 0, statusText: "" });
        response[INTERNALS$1].type = "error";
        return response;
      }
      get [Symbol.toStringTag]() {
        return "Response";
      }
    };
    Object.defineProperties(Response2.prototype, {
      type: { enumerable: true },
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    getSearch = (parsedURL) => {
      if (parsedURL.search) {
        return parsedURL.search;
      }
      const lastOffset = parsedURL.href.length - 1;
      const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
      return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
    };
    ReferrerPolicy = /* @__PURE__ */ new Set([
      "",
      "no-referrer",
      "no-referrer-when-downgrade",
      "same-origin",
      "origin",
      "strict-origin",
      "origin-when-cross-origin",
      "strict-origin-when-cross-origin",
      "unsafe-url"
    ]);
    DEFAULT_REFERRER_POLICY = "strict-origin-when-cross-origin";
    INTERNALS = Symbol("Request internals");
    isRequest = (object) => {
      return typeof object === "object" && typeof object[INTERNALS] === "object";
    };
    doBadDataWarn = (0, import_node_util.deprecate)(() => {
    }, ".data is not a valid RequestInit property, use .body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (request)");
    Request2 = class extends Body {
      constructor(input, init2 = {}) {
        let parsedURL;
        if (isRequest(input)) {
          parsedURL = new URL(input.url);
        } else {
          parsedURL = new URL(input);
          input = {};
        }
        if (parsedURL.username !== "" || parsedURL.password !== "") {
          throw new TypeError(`${parsedURL} is an url with embedded credentials.`);
        }
        let method = init2.method || input.method || "GET";
        if (/^(delete|get|head|options|post|put)$/i.test(method)) {
          method = method.toUpperCase();
        }
        if ("data" in init2) {
          doBadDataWarn();
        }
        if ((init2.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
        super(inputBody, {
          size: init2.size || input.size || 0
        });
        const headers = new Headers2(init2.headers || input.headers || {});
        if (inputBody !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody, this);
          if (contentType) {
            headers.set("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init2) {
          signal = init2.signal;
        }
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
        }
        let referrer = init2.referrer == null ? input.referrer : init2.referrer;
        if (referrer === "") {
          referrer = "no-referrer";
        } else if (referrer) {
          const parsedReferrer = new URL(referrer);
          referrer = /^about:(\/\/)?client$/.test(parsedReferrer) ? "client" : parsedReferrer;
        } else {
          referrer = void 0;
        }
        this[INTERNALS] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal,
          referrer
        };
        this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
        this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
        this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
        this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
        this.referrerPolicy = init2.referrerPolicy || input.referrerPolicy || "";
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return (0, import_node_url.format)(this[INTERNALS].parsedURL);
      }
      get headers() {
        return this[INTERNALS].headers;
      }
      get redirect() {
        return this[INTERNALS].redirect;
      }
      get signal() {
        return this[INTERNALS].signal;
      }
      get referrer() {
        if (this[INTERNALS].referrer === "no-referrer") {
          return "";
        }
        if (this[INTERNALS].referrer === "client") {
          return "about:client";
        }
        if (this[INTERNALS].referrer) {
          return this[INTERNALS].referrer.toString();
        }
        return void 0;
      }
      get referrerPolicy() {
        return this[INTERNALS].referrerPolicy;
      }
      set referrerPolicy(referrerPolicy) {
        this[INTERNALS].referrerPolicy = validateReferrerPolicy(referrerPolicy);
      }
      clone() {
        return new Request2(this);
      }
      get [Symbol.toStringTag]() {
        return "Request";
      }
    };
    Object.defineProperties(Request2.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true },
      referrer: { enumerable: true },
      referrerPolicy: { enumerable: true }
    });
    getNodeRequestOptions = (request) => {
      const { parsedURL } = request[INTERNALS];
      const headers = new Headers2(request[INTERNALS].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      let contentLengthValue = null;
      if (request.body === null && /^(post|put)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body !== null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (request.referrerPolicy === "") {
        request.referrerPolicy = DEFAULT_REFERRER_POLICY;
      }
      if (request.referrer && request.referrer !== "no-referrer") {
        request[INTERNALS].referrer = determineRequestsReferrer(request);
      } else {
        request[INTERNALS].referrer = "no-referrer";
      }
      if (request[INTERNALS].referrer instanceof URL) {
        headers.set("Referer", request.referrer);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate,br");
      }
      let { agent } = request;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      const search = getSearch(parsedURL);
      const options = {
        path: parsedURL.pathname + search,
        method: request.method,
        headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
        insecureHTTPParser: request.insecureHTTPParser,
        agent
      };
      return {
        parsedURL,
        options
      };
    };
    AbortError = class extends FetchBaseError {
      constructor(message, type = "aborted") {
        super(message, type);
      }
    };
    if (!globalThis.DOMException) {
      try {
        const { MessageChannel } = require("worker_threads"), port = new MessageChannel().port1, ab = new ArrayBuffer();
        port.postMessage(ab, [ab, ab]);
      } catch (err) {
        err.constructor.name === "DOMException" && (globalThis.DOMException = err.constructor);
      }
    }
    supportedSchemas = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
    globals = {
      crypto: import_crypto.webcrypto,
      fetch: fetch2,
      Response: Response2,
      Request: Request2,
      Headers: Headers2
    };
  }
});

// node_modules/svelte-adapter-firebase/src/files/shims.js
var init_shims = __esm({
  "node_modules/svelte-adapter-firebase/src/files/shims.js"() {
    init_polyfills();
    installPolyfills();
  }
});

// .svelte-kit/output/server/chunks/index-43ce8bc5.js
function noop2() {
}

function run(fn) {
  return fn();
}

function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}

function run_all(fns) {
  fns.forEach(run);
}

function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}

function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key2, context) {
  get_current_component().$$.context.set(key2, context);
  return context;
}
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function escape_attribute_value(value) {
  return typeof value === "string" ? escape(value) : value;
}
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = /* @__PURE__ */ new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: /* @__PURE__ */ new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css8) => css8.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  const assignment = boolean && value === true ? "" : `="${escape_attribute_value(value.toString())}"`;
  return ` ${name}${assignment}`;
}

var current_component, escaped, missing_component, on_destroy;
var init_index_43ce8bc5 = __esm({
  ".svelte-kit/output/server/chunks/index-43ce8bc5.js"() {
    init_shims();
    Promise.resolve();
    escaped = {
      "\"": "&quot;",
      "'": "&#39;",
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;"
    };
    missing_component = {
      $$render: () => ""
    };
  }
});

// .svelte-kit/output/server/chunks/hooks-1c45ba0b.js
var hooks_1c45ba0b_exports = {};
var init_hooks_1c45ba0b = __esm({
  ".svelte-kit/output/server/chunks/hooks-1c45ba0b.js"() {
    init_shims();
  }
});

// .svelte-kit/output/server/entries/fallbacks/layout.svelte.js
var layout_svelte_exports = {};
__export(layout_svelte_exports, {
  default: () => Layout
});
var Layout;
var init_layout_svelte = __esm({
  ".svelte-kit/output/server/entries/fallbacks/layout.svelte.js"() {
    init_shims();
    init_index_43ce8bc5();
    Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${slots.default ? slots.default({}) : ``}`;
    });
  }
});

// .svelte-kit/output/server/nodes/0.js
var __exports = {};
__export(__exports, {
  css: () => css,
  entry: () => entry,
  index: () => index,
  js: () => js,
  module: () => layout_svelte_exports
});
var index, entry, js, css;
var init__ = __esm({
  ".svelte-kit/output/server/nodes/0.js"() {
    init_shims();
    init_layout_svelte();
    index = 0;
    entry = "layout.svelte-e0726df8.js";
    js = ["layout.svelte-e0726df8.js", "chunks/index-ceb1e3f7.js"];
    css = [];
  }
});

// .svelte-kit/output/server/entries/fallbacks/error.svelte.js
var error_svelte_exports = {};
__export(error_svelte_exports, {
  default: () => Error2,
  load: () => load
});

function load({ error: error2, status }) {
  return { props: { error: error2, status } };
}
var Error2;
var init_error_svelte = __esm({
  ".svelte-kit/output/server/entries/fallbacks/error.svelte.js"() {
    init_shims();
    init_index_43ce8bc5();
    Error2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { status } = $$props;
      let { error: error2 } = $$props;
      if ($$props.status === void 0 && $$bindings.status && status !== void 0)
        $$bindings.status(status);
      if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
        $$bindings.error(error2);
      return `<h1>${escape(status)}</h1>

<pre>${escape(error2.message)}</pre>



${error2.frame ? `<pre>${escape(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
    });
  }
});

// .svelte-kit/output/server/nodes/1.js
var __exports2 = {};
__export(__exports2, {
  css: () => css2,
  entry: () => entry2,
  index: () => index2,
  js: () => js2,
  module: () => error_svelte_exports
});
var index2, entry2, js2, css2;
var init__2 = __esm({
  ".svelte-kit/output/server/nodes/1.js"() {
    init_shims();
    init_error_svelte();
    index2 = 1;
    entry2 = "error.svelte-bd08d597.js";
    js2 = ["error.svelte-bd08d597.js", "chunks/index-ceb1e3f7.js"];
    css2 = [];
  }
});

// node_modules/lodash/lodash.js
var require_lodash = __commonJS({
  "node_modules/lodash/lodash.js"(exports, module2) {
    init_shims();
    (function() {
      var undefined2;
      var VERSION = "4.17.21";
      var LARGE_ARRAY_SIZE = 200;
      var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",
        FUNC_ERROR_TEXT = "Expected a function",
        INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`";
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      var MAX_MEMOIZE_SIZE = 500;
      var PLACEHOLDER = "__lodash_placeholder__";
      var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
      var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
      var WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG = 8,
        WRAP_CURRY_RIGHT_FLAG = 16, WRAP_PARTIAL_FLAG = 32, WRAP_PARTIAL_RIGHT_FLAG = 64, WRAP_ARY_FLAG = 128,
        WRAP_REARG_FLAG = 256, WRAP_FLIP_FLAG = 512;
      var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
      var HOT_COUNT = 800, HOT_SPAN = 16;
      var LAZY_FILTER_FLAG = 1, LAZY_MAP_FLAG = 2, LAZY_WHILE_FLAG = 3;
      var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 17976931348623157e292, NAN = 0 / 0;
      var MAX_ARRAY_LENGTH = 4294967295, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
        HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
      var wrapFlags = [
        ["ary", WRAP_ARY_FLAG],
        ["bind", WRAP_BIND_FLAG],
        ["bindKey", WRAP_BIND_KEY_FLAG],
        ["curry", WRAP_CURRY_FLAG],
        ["curryRight", WRAP_CURRY_RIGHT_FLAG],
        ["flip", WRAP_FLIP_FLAG],
        ["partial", WRAP_PARTIAL_FLAG],
        ["partialRight", WRAP_PARTIAL_RIGHT_FLAG],
        ["rearg", WRAP_REARG_FLAG]
      ];
      var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]",
        boolTag = "[object Boolean]", dateTag = "[object Date]", domExcTag = "[object DOMException]",
        errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]",
        mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]",
        objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]",
        regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]",
        symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]",
        weakSetTag = "[object WeakSet]";
      var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]",
        float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]",
        int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]",
        uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]",
        uint32Tag = "[object Uint32Array]";
      var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
        reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
      var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reUnescapedHtml = /[&<>"']/g,
        reHasEscapedHtml = RegExp(reEscapedHtml.source), reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
      var reEscape = /<%-([\s\S]+?)%>/g, reEvaluate = /<%([\s\S]+?)%>/g, reInterpolate = /<%=([\s\S]+?)%>/g;
      var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/,
        rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
      var reTrimStart = /^\s+/;
      var reWhitespace = /\s/;
      var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
        reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
      var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
      var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
      var reEscapeChar = /\\(\\)?/g;
      var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
      var reFlags = /\w*$/;
      var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
      var reIsBinary = /^0b[01]+$/i;
      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      var reIsOctal = /^0o[0-7]+$/i;
      var reIsUint = /^(?:0|[1-9]\d*)$/;
      var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
      var reNoMatch = /($^)/;
      var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
      var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f",
        reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff",
        rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
        rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff",
        rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",
        rsPunctuationRange = "\\u2000-\\u206f",
        rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
        rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange = "\\ufe0e\\ufe0f",
        rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
      var rsApos = "['\u2019]", rsAstral = "[" + rsAstralRange + "]", rsBreak = "[" + rsBreakRange + "]",
        rsCombo = "[" + rsComboRange + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]",
        rsLower = "[" + rsLowerRange + "]",
        rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]",
        rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")",
        rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}",
        rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ = "\\u200d";
      var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")",
        rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?",
        rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?", reOptMod = rsModifier + "?",
        rsOptVar = "[" + rsVarRange + "]?",
        rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*",
        rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",
        rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq = rsOptVar + reOptMod + rsOptJoin,
        rsEmoji = "(?:" + [rsDingbat, rsRegional, rsSurrPair].join("|") + ")" + rsSeq,
        rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
      var reApos = RegExp(rsApos, "g");
      var reComboMark = RegExp(rsCombo, "g");
      var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
      var reUnicodeWord = RegExp([
        rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")",
        rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [rsBreak, rsUpper + rsMiscLower, "$"].join("|") + ")",
        rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
        rsUpper + "+" + rsOptContrUpper,
        rsOrdUpper,
        rsOrdLower,
        rsDigits,
        rsEmoji
      ].join("|"), "g");
      var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
      var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
      var contextProps = [
        "Array",
        "Buffer",
        "DataView",
        "Date",
        "Error",
        "Float32Array",
        "Float64Array",
        "Function",
        "Int8Array",
        "Int16Array",
        "Int32Array",
        "Map",
        "Math",
        "Object",
        "Promise",
        "RegExp",
        "Set",
        "String",
        "Symbol",
        "TypeError",
        "Uint8Array",
        "Uint8ClampedArray",
        "Uint16Array",
        "Uint32Array",
        "WeakMap",
        "_",
        "clearTimeout",
        "isFinite",
        "parseInt",
        "setTimeout"
      ];
      var templateCounter = -1;
      var typedArrayTags = {};
      typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
      typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
      var cloneableTags = {};
      cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
      cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
      var deburredLetters = {
        "\xC0": "A",
        "\xC1": "A",
        "\xC2": "A",
        "\xC3": "A",
        "\xC4": "A",
        "\xC5": "A",
        "\xE0": "a",
        "\xE1": "a",
        "\xE2": "a",
        "\xE3": "a",
        "\xE4": "a",
        "\xE5": "a",
        "\xC7": "C",
        "\xE7": "c",
        "\xD0": "D",
        "\xF0": "d",
        "\xC8": "E",
        "\xC9": "E",
        "\xCA": "E",
        "\xCB": "E",
        "\xE8": "e",
        "\xE9": "e",
        "\xEA": "e",
        "\xEB": "e",
        "\xCC": "I",
        "\xCD": "I",
        "\xCE": "I",
        "\xCF": "I",
        "\xEC": "i",
        "\xED": "i",
        "\xEE": "i",
        "\xEF": "i",
        "\xD1": "N",
        "\xF1": "n",
        "\xD2": "O",
        "\xD3": "O",
        "\xD4": "O",
        "\xD5": "O",
        "\xD6": "O",
        "\xD8": "O",
        "\xF2": "o",
        "\xF3": "o",
        "\xF4": "o",
        "\xF5": "o",
        "\xF6": "o",
        "\xF8": "o",
        "\xD9": "U",
        "\xDA": "U",
        "\xDB": "U",
        "\xDC": "U",
        "\xF9": "u",
        "\xFA": "u",
        "\xFB": "u",
        "\xFC": "u",
        "\xDD": "Y",
        "\xFD": "y",
        "\xFF": "y",
        "\xC6": "Ae",
        "\xE6": "ae",
        "\xDE": "Th",
        "\xFE": "th",
        "\xDF": "ss",
        "\u0100": "A",
        "\u0102": "A",
        "\u0104": "A",
        "\u0101": "a",
        "\u0103": "a",
        "\u0105": "a",
        "\u0106": "C",
        "\u0108": "C",
        "\u010A": "C",
        "\u010C": "C",
        "\u0107": "c",
        "\u0109": "c",
        "\u010B": "c",
        "\u010D": "c",
        "\u010E": "D",
        "\u0110": "D",
        "\u010F": "d",
        "\u0111": "d",
        "\u0112": "E",
        "\u0114": "E",
        "\u0116": "E",
        "\u0118": "E",
        "\u011A": "E",
        "\u0113": "e",
        "\u0115": "e",
        "\u0117": "e",
        "\u0119": "e",
        "\u011B": "e",
        "\u011C": "G",
        "\u011E": "G",
        "\u0120": "G",
        "\u0122": "G",
        "\u011D": "g",
        "\u011F": "g",
        "\u0121": "g",
        "\u0123": "g",
        "\u0124": "H",
        "\u0126": "H",
        "\u0125": "h",
        "\u0127": "h",
        "\u0128": "I",
        "\u012A": "I",
        "\u012C": "I",
        "\u012E": "I",
        "\u0130": "I",
        "\u0129": "i",
        "\u012B": "i",
        "\u012D": "i",
        "\u012F": "i",
        "\u0131": "i",
        "\u0134": "J",
        "\u0135": "j",
        "\u0136": "K",
        "\u0137": "k",
        "\u0138": "k",
        "\u0139": "L",
        "\u013B": "L",
        "\u013D": "L",
        "\u013F": "L",
        "\u0141": "L",
        "\u013A": "l",
        "\u013C": "l",
        "\u013E": "l",
        "\u0140": "l",
        "\u0142": "l",
        "\u0143": "N",
        "\u0145": "N",
        "\u0147": "N",
        "\u014A": "N",
        "\u0144": "n",
        "\u0146": "n",
        "\u0148": "n",
        "\u014B": "n",
        "\u014C": "O",
        "\u014E": "O",
        "\u0150": "O",
        "\u014D": "o",
        "\u014F": "o",
        "\u0151": "o",
        "\u0154": "R",
        "\u0156": "R",
        "\u0158": "R",
        "\u0155": "r",
        "\u0157": "r",
        "\u0159": "r",
        "\u015A": "S",
        "\u015C": "S",
        "\u015E": "S",
        "\u0160": "S",
        "\u015B": "s",
        "\u015D": "s",
        "\u015F": "s",
        "\u0161": "s",
        "\u0162": "T",
        "\u0164": "T",
        "\u0166": "T",
        "\u0163": "t",
        "\u0165": "t",
        "\u0167": "t",
        "\u0168": "U",
        "\u016A": "U",
        "\u016C": "U",
        "\u016E": "U",
        "\u0170": "U",
        "\u0172": "U",
        "\u0169": "u",
        "\u016B": "u",
        "\u016D": "u",
        "\u016F": "u",
        "\u0171": "u",
        "\u0173": "u",
        "\u0174": "W",
        "\u0175": "w",
        "\u0176": "Y",
        "\u0177": "y",
        "\u0178": "Y",
        "\u0179": "Z",
        "\u017B": "Z",
        "\u017D": "Z",
        "\u017A": "z",
        "\u017C": "z",
        "\u017E": "z",
        "\u0132": "IJ",
        "\u0133": "ij",
        "\u0152": "Oe",
        "\u0153": "oe",
        "\u0149": "'n",
        "\u017F": "s"
      };
      var htmlEscapes = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      };
      var htmlUnescapes = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": "\"",
        "&#39;": "'"
      };
      var stringEscapes = {
        "\\": "\\",
        "'": "'",
        "\n": "n",
        "\r": "r",
        "\u2028": "u2028",
        "\u2029": "u2029"
      };
      var freeParseFloat = parseFloat, freeParseInt = parseInt;
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule = freeExports && typeof module2 == "object" && module2 && !module2.nodeType && module2;
      var moduleExports = freeModule && freeModule.exports === freeExports;
      var freeProcess = moduleExports && freeGlobal.process;
      var nodeUtil = function() {
        try {
          var types2 = freeModule && freeModule.require && freeModule.require("util").types;
          if (types2) {
            return types2;
          }
          return freeProcess && freeProcess.binding && freeProcess.binding("util");
        } catch (e2) {
        }
      }();
      var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer, nodeIsDate = nodeUtil && nodeUtil.isDate,
        nodeIsMap = nodeUtil && nodeUtil.isMap, nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
        nodeIsSet = nodeUtil && nodeUtil.isSet, nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

      function apply(func, thisArg, args) {
        switch (args.length) {
          case 0:
            return func.call(thisArg);
          case 1:
            return func.call(thisArg, args[0]);
          case 2:
            return func.call(thisArg, args[0], args[1]);
          case 3:
            return func.call(thisArg, args[0], args[1], args[2]);
        }
        return func.apply(thisArg, args);
      }

      function arrayAggregator(array2, setter, iteratee, accumulator) {
        var index7 = -1, length = array2 == null ? 0 : array2.length;
        while (++index7 < length) {
          var value = array2[index7];
          setter(accumulator, value, iteratee(value), array2);
        }
        return accumulator;
      }

      function arrayEach(array2, iteratee) {
        var index7 = -1, length = array2 == null ? 0 : array2.length;
        while (++index7 < length) {
          if (iteratee(array2[index7], index7, array2) === false) {
            break;
          }
        }
        return array2;
      }

      function arrayEachRight(array2, iteratee) {
        var length = array2 == null ? 0 : array2.length;
        while (length--) {
          if (iteratee(array2[length], length, array2) === false) {
            break;
          }
        }
        return array2;
      }

      function arrayEvery(array2, predicate) {
        var index7 = -1, length = array2 == null ? 0 : array2.length;
        while (++index7 < length) {
          if (!predicate(array2[index7], index7, array2)) {
            return false;
          }
        }
        return true;
      }

      function arrayFilter(array2, predicate) {
        var index7 = -1, length = array2 == null ? 0 : array2.length, resIndex = 0, result = [];
        while (++index7 < length) {
          var value = array2[index7];
          if (predicate(value, index7, array2)) {
            result[resIndex++] = value;
          }
        }
        return result;
      }

      function arrayIncludes(array2, value) {
        var length = array2 == null ? 0 : array2.length;
        return !!length && baseIndexOf(array2, value, 0) > -1;
      }

      function arrayIncludesWith(array2, value, comparator) {
        var index7 = -1, length = array2 == null ? 0 : array2.length;
        while (++index7 < length) {
          if (comparator(value, array2[index7])) {
            return true;
          }
        }
        return false;
      }

      function arrayMap(array2, iteratee) {
        var index7 = -1, length = array2 == null ? 0 : array2.length, result = Array(length);
        while (++index7 < length) {
          result[index7] = iteratee(array2[index7], index7, array2);
        }
        return result;
      }

      function arrayPush(array2, values) {
        var index7 = -1, length = values.length, offset = array2.length;
        while (++index7 < length) {
          array2[offset + index7] = values[index7];
        }
        return array2;
      }

      function arrayReduce(array2, iteratee, accumulator, initAccum) {
        var index7 = -1, length = array2 == null ? 0 : array2.length;
        if (initAccum && length) {
          accumulator = array2[++index7];
        }
        while (++index7 < length) {
          accumulator = iteratee(accumulator, array2[index7], index7, array2);
        }
        return accumulator;
      }

      function arrayReduceRight(array2, iteratee, accumulator, initAccum) {
        var length = array2 == null ? 0 : array2.length;
        if (initAccum && length) {
          accumulator = array2[--length];
        }
        while (length--) {
          accumulator = iteratee(accumulator, array2[length], length, array2);
        }
        return accumulator;
      }

      function arraySome(array2, predicate) {
        var index7 = -1, length = array2 == null ? 0 : array2.length;
        while (++index7 < length) {
          if (predicate(array2[index7], index7, array2)) {
            return true;
          }
        }
        return false;
      }

      var asciiSize = baseProperty("length");

      function asciiToArray(string) {
        return string.split("");
      }

      function asciiWords(string) {
        return string.match(reAsciiWord) || [];
      }

      function baseFindKey(collection, predicate, eachFunc) {
        var result;
        eachFunc(collection, function(value, key2, collection2) {
          if (predicate(value, key2, collection2)) {
            result = key2;
            return false;
          }
        });
        return result;
      }

      function baseFindIndex(array2, predicate, fromIndex, fromRight) {
        var length = array2.length, index7 = fromIndex + (fromRight ? 1 : -1);
        while (fromRight ? index7-- : ++index7 < length) {
          if (predicate(array2[index7], index7, array2)) {
            return index7;
          }
        }
        return -1;
      }

      function baseIndexOf(array2, value, fromIndex) {
        return value === value ? strictIndexOf(array2, value, fromIndex) : baseFindIndex(array2, baseIsNaN, fromIndex);
      }

      function baseIndexOfWith(array2, value, fromIndex, comparator) {
        var index7 = fromIndex - 1, length = array2.length;
        while (++index7 < length) {
          if (comparator(array2[index7], value)) {
            return index7;
          }
        }
        return -1;
      }

      function baseIsNaN(value) {
        return value !== value;
      }

      function baseMean(array2, iteratee) {
        var length = array2 == null ? 0 : array2.length;
        return length ? baseSum(array2, iteratee) / length : NAN;
      }

      function baseProperty(key2) {
        return function(object) {
          return object == null ? undefined2 : object[key2];
        };
      }

      function basePropertyOf(object) {
        return function(key2) {
          return object == null ? undefined2 : object[key2];
        };
      }

      function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
        eachFunc(collection, function(value, index7, collection2) {
          accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index7, collection2);
        });
        return accumulator;
      }

      function baseSortBy(array2, comparer) {
        var length = array2.length;
        array2.sort(comparer);
        while (length--) {
          array2[length] = array2[length].value;
        }
        return array2;
      }

      function baseSum(array2, iteratee) {
        var result, index7 = -1, length = array2.length;
        while (++index7 < length) {
          var current = iteratee(array2[index7]);
          if (current !== undefined2) {
            result = result === undefined2 ? current : result + current;
          }
        }
        return result;
      }

      function baseTimes(n, iteratee) {
        var index7 = -1, result = Array(n);
        while (++index7 < n) {
          result[index7] = iteratee(index7);
        }
        return result;
      }

      function baseToPairs(object, props) {
        return arrayMap(props, function(key2) {
          return [key2, object[key2]];
        });
      }

      function baseTrim(string) {
        return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
      }

      function baseUnary(func) {
        return function(value) {
          return func(value);
        };
      }

      function baseValues(object, props) {
        return arrayMap(props, function(key2) {
          return object[key2];
        });
      }

      function cacheHas(cache, key2) {
        return cache.has(key2);
      }

      function charsStartIndex(strSymbols, chrSymbols) {
        var index7 = -1, length = strSymbols.length;
        while (++index7 < length && baseIndexOf(chrSymbols, strSymbols[index7], 0) > -1) {
        }
        return index7;
      }

      function charsEndIndex(strSymbols, chrSymbols) {
        var index7 = strSymbols.length;
        while (index7-- && baseIndexOf(chrSymbols, strSymbols[index7], 0) > -1) {
        }
        return index7;
      }

      function countHolders(array2, placeholder) {
        var length = array2.length, result = 0;
        while (length--) {
          if (array2[length] === placeholder) {
            ++result;
          }
        }
        return result;
      }

      var deburrLetter = basePropertyOf(deburredLetters);
      var escapeHtmlChar = basePropertyOf(htmlEscapes);

      function escapeStringChar(chr) {
        return "\\" + stringEscapes[chr];
      }

      function getValue(object, key2) {
        return object == null ? undefined2 : object[key2];
      }

      function hasUnicode(string) {
        return reHasUnicode.test(string);
      }

      function hasUnicodeWord(string) {
        return reHasUnicodeWord.test(string);
      }

      function iteratorToArray(iterator) {
        var data, result = [];
        while (!(data = iterator.next()).done) {
          result.push(data.value);
        }
        return result;
      }

      function mapToArray(map) {
        var index7 = -1, result = Array(map.size);
        map.forEach(function(value, key2) {
          result[++index7] = [key2, value];
        });
        return result;
      }

      function overArg(func, transform) {
        return function(arg) {
          return func(transform(arg));
        };
      }

      function replaceHolders(array2, placeholder) {
        var index7 = -1, length = array2.length, resIndex = 0, result = [];
        while (++index7 < length) {
          var value = array2[index7];
          if (value === placeholder || value === PLACEHOLDER) {
            array2[index7] = PLACEHOLDER;
            result[resIndex++] = index7;
          }
        }
        return result;
      }

      function setToArray(set) {
        var index7 = -1, result = Array(set.size);
        set.forEach(function(value) {
          result[++index7] = value;
        });
        return result;
      }

      function setToPairs(set) {
        var index7 = -1, result = Array(set.size);
        set.forEach(function(value) {
          result[++index7] = [value, value];
        });
        return result;
      }

      function strictIndexOf(array2, value, fromIndex) {
        var index7 = fromIndex - 1, length = array2.length;
        while (++index7 < length) {
          if (array2[index7] === value) {
            return index7;
          }
        }
        return -1;
      }

      function strictLastIndexOf(array2, value, fromIndex) {
        var index7 = fromIndex + 1;
        while (index7--) {
          if (array2[index7] === value) {
            return index7;
          }
        }
        return index7;
      }

      function stringSize(string) {
        return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
      }

      function stringToArray(string) {
        return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
      }

      function trimmedEndIndex(string) {
        var index7 = string.length;
        while (index7-- && reWhitespace.test(string.charAt(index7))) {
        }
        return index7;
      }

      var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

      function unicodeSize(string) {
        var result = reUnicode.lastIndex = 0;
        while (reUnicode.test(string)) {
          ++result;
        }
        return result;
      }

      function unicodeToArray(string) {
        return string.match(reUnicode) || [];
      }

      function unicodeWords(string) {
        return string.match(reUnicodeWord) || [];
      }

      var runInContext = function runInContext2(context) {
        context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));
        var Array2 = context.Array, Date2 = context.Date, Error3 = context.Error, Function2 = context.Function,
          Math2 = context.Math, Object2 = context.Object, RegExp2 = context.RegExp, String2 = context.String,
          TypeError2 = context.TypeError;
        var arrayProto = Array2.prototype, funcProto = Function2.prototype, objectProto = Object2.prototype;
        var coreJsData = context["__core-js_shared__"];
        var funcToString = funcProto.toString;
        var hasOwnProperty = objectProto.hasOwnProperty;
        var idCounter = 0;
        var maskSrcKey = function() {
          var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
          return uid ? "Symbol(src)_1." + uid : "";
        }();
        var nativeObjectToString = objectProto.toString;
        var objectCtorString = funcToString.call(Object2);
        var oldDash = root._;
        var reIsNative = RegExp2("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
        var Buffer2 = moduleExports ? context.Buffer : undefined2, Symbol2 = context.Symbol,
          Uint8Array2 = context.Uint8Array, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : undefined2,
          getPrototype = overArg(Object2.getPrototypeOf, Object2), objectCreate = Object2.create,
          propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice,
          spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : undefined2,
          symIterator = Symbol2 ? Symbol2.iterator : undefined2,
          symToStringTag = Symbol2 ? Symbol2.toStringTag : undefined2;
        var defineProperty = function() {
          try {
            var func = getNative(Object2, "defineProperty");
            func({}, "", {});
            return func;
          } catch (e2) {
          }
        }();
        var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout,
          ctxNow = Date2 && Date2.now !== root.Date.now && Date2.now,
          ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
        var nativeCeil = Math2.ceil, nativeFloor = Math2.floor, nativeGetSymbols = Object2.getOwnPropertySymbols,
          nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : undefined2, nativeIsFinite = context.isFinite,
          nativeJoin = arrayProto.join, nativeKeys = overArg(Object2.keys, Object2), nativeMax = Math2.max,
          nativeMin = Math2.min, nativeNow = Date2.now, nativeParseInt = context.parseInt, nativeRandom = Math2.random,
          nativeReverse = arrayProto.reverse;
        var DataView2 = getNative(context, "DataView"), Map2 = getNative(context, "Map"),
          Promise2 = getNative(context, "Promise"), Set2 = getNative(context, "Set"),
          WeakMap = getNative(context, "WeakMap"), nativeCreate = getNative(Object2, "create");
        var metaMap = WeakMap && new WeakMap();
        var realNames = {};
        var dataViewCtorString = toSource(DataView2), mapCtorString = toSource(Map2),
          promiseCtorString = toSource(Promise2), setCtorString = toSource(Set2), weakMapCtorString = toSource(WeakMap);
        var symbolProto = Symbol2 ? Symbol2.prototype : undefined2,
          symbolValueOf = symbolProto ? symbolProto.valueOf : undefined2,
          symbolToString = symbolProto ? symbolProto.toString : undefined2;

        function lodash(value) {
          if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
            if (value instanceof LodashWrapper) {
              return value;
            }
            if (hasOwnProperty.call(value, "__wrapped__")) {
              return wrapperClone(value);
            }
          }
          return new LodashWrapper(value);
        }

        var baseCreate = function() {
          function object() {
          }

          return function(proto) {
            if (!isObject(proto)) {
              return {};
            }
            if (objectCreate) {
              return objectCreate(proto);
            }
            object.prototype = proto;
            var result2 = new object();
            object.prototype = undefined2;
            return result2;
          };
        }();

        function baseLodash() {
        }

        function LodashWrapper(value, chainAll) {
          this.__wrapped__ = value;
          this.__actions__ = [];
          this.__chain__ = !!chainAll;
          this.__index__ = 0;
          this.__values__ = undefined2;
        }

        lodash.templateSettings = {
          "escape": reEscape,
          "evaluate": reEvaluate,
          "interpolate": reInterpolate,
          "variable": "",
          "imports": {
            "_": lodash
          }
        };
        lodash.prototype = baseLodash.prototype;
        lodash.prototype.constructor = lodash;
        LodashWrapper.prototype = baseCreate(baseLodash.prototype);
        LodashWrapper.prototype.constructor = LodashWrapper;

        function LazyWrapper(value) {
          this.__wrapped__ = value;
          this.__actions__ = [];
          this.__dir__ = 1;
          this.__filtered__ = false;
          this.__iteratees__ = [];
          this.__takeCount__ = MAX_ARRAY_LENGTH;
          this.__views__ = [];
        }

        function lazyClone() {
          var result2 = new LazyWrapper(this.__wrapped__);
          result2.__actions__ = copyArray(this.__actions__);
          result2.__dir__ = this.__dir__;
          result2.__filtered__ = this.__filtered__;
          result2.__iteratees__ = copyArray(this.__iteratees__);
          result2.__takeCount__ = this.__takeCount__;
          result2.__views__ = copyArray(this.__views__);
          return result2;
        }

        function lazyReverse() {
          if (this.__filtered__) {
            var result2 = new LazyWrapper(this);
            result2.__dir__ = -1;
            result2.__filtered__ = true;
          } else {
            result2 = this.clone();
            result2.__dir__ *= -1;
          }
          return result2;
        }

        function lazyValue() {
          var array2 = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray(array2), isRight = dir < 0,
            arrLength = isArr ? array2.length : 0, view = getView(0, arrLength, this.__views__), start = view.start,
            end = view.end, length = end - start, index7 = isRight ? end : start - 1, iteratees = this.__iteratees__,
            iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin(length, this.__takeCount__);
          if (!isArr || !isRight && arrLength == length && takeCount == length) {
            return baseWrapperValue(array2, this.__actions__);
          }
          var result2 = [];
          outer:
            while (length-- && resIndex < takeCount) {
              index7 += dir;
              var iterIndex = -1, value = array2[index7];
              while (++iterIndex < iterLength) {
                var data = iteratees[iterIndex], iteratee2 = data.iteratee, type = data.type,
                  computed = iteratee2(value);
                if (type == LAZY_MAP_FLAG) {
                  value = computed;
                } else if (!computed) {
                  if (type == LAZY_FILTER_FLAG) {
                    continue outer;
                  } else {
                    break outer;
                  }
                }
              }
              result2[resIndex++] = value;
            }
          return result2;
        }

        LazyWrapper.prototype = baseCreate(baseLodash.prototype);
        LazyWrapper.prototype.constructor = LazyWrapper;

        function Hash(entries) {
          var index7 = -1, length = entries == null ? 0 : entries.length;
          this.clear();
          while (++index7 < length) {
            var entry7 = entries[index7];
            this.set(entry7[0], entry7[1]);
          }
        }

        function hashClear() {
          this.__data__ = nativeCreate ? nativeCreate(null) : {};
          this.size = 0;
        }

        function hashDelete(key2) {
          var result2 = this.has(key2) && delete this.__data__[key2];
          this.size -= result2 ? 1 : 0;
          return result2;
        }

        function hashGet(key2) {
          var data = this.__data__;
          if (nativeCreate) {
            var result2 = data[key2];
            return result2 === HASH_UNDEFINED ? undefined2 : result2;
          }
          return hasOwnProperty.call(data, key2) ? data[key2] : undefined2;
        }

        function hashHas(key2) {
          var data = this.__data__;
          return nativeCreate ? data[key2] !== undefined2 : hasOwnProperty.call(data, key2);
        }

        function hashSet(key2, value) {
          var data = this.__data__;
          this.size += this.has(key2) ? 0 : 1;
          data[key2] = nativeCreate && value === undefined2 ? HASH_UNDEFINED : value;
          return this;
        }

        Hash.prototype.clear = hashClear;
        Hash.prototype["delete"] = hashDelete;
        Hash.prototype.get = hashGet;
        Hash.prototype.has = hashHas;
        Hash.prototype.set = hashSet;

        function ListCache(entries) {
          var index7 = -1, length = entries == null ? 0 : entries.length;
          this.clear();
          while (++index7 < length) {
            var entry7 = entries[index7];
            this.set(entry7[0], entry7[1]);
          }
        }

        function listCacheClear() {
          this.__data__ = [];
          this.size = 0;
        }

        function listCacheDelete(key2) {
          var data = this.__data__, index7 = assocIndexOf(data, key2);
          if (index7 < 0) {
            return false;
          }
          var lastIndex = data.length - 1;
          if (index7 == lastIndex) {
            data.pop();
          } else {
            splice.call(data, index7, 1);
          }
          --this.size;
          return true;
        }

        function listCacheGet(key2) {
          var data = this.__data__, index7 = assocIndexOf(data, key2);
          return index7 < 0 ? undefined2 : data[index7][1];
        }

        function listCacheHas(key2) {
          return assocIndexOf(this.__data__, key2) > -1;
        }

        function listCacheSet(key2, value) {
          var data = this.__data__, index7 = assocIndexOf(data, key2);
          if (index7 < 0) {
            ++this.size;
            data.push([key2, value]);
          } else {
            data[index7][1] = value;
          }
          return this;
        }

        ListCache.prototype.clear = listCacheClear;
        ListCache.prototype["delete"] = listCacheDelete;
        ListCache.prototype.get = listCacheGet;
        ListCache.prototype.has = listCacheHas;
        ListCache.prototype.set = listCacheSet;

        function MapCache(entries) {
          var index7 = -1, length = entries == null ? 0 : entries.length;
          this.clear();
          while (++index7 < length) {
            var entry7 = entries[index7];
            this.set(entry7[0], entry7[1]);
          }
        }

        function mapCacheClear() {
          this.size = 0;
          this.__data__ = {
            "hash": new Hash(),
            "map": new (Map2 || ListCache)(),
            "string": new Hash()
          };
        }

        function mapCacheDelete(key2) {
          var result2 = getMapData(this, key2)["delete"](key2);
          this.size -= result2 ? 1 : 0;
          return result2;
        }

        function mapCacheGet(key2) {
          return getMapData(this, key2).get(key2);
        }

        function mapCacheHas(key2) {
          return getMapData(this, key2).has(key2);
        }

        function mapCacheSet(key2, value) {
          var data = getMapData(this, key2), size2 = data.size;
          data.set(key2, value);
          this.size += data.size == size2 ? 0 : 1;
          return this;
        }

        MapCache.prototype.clear = mapCacheClear;
        MapCache.prototype["delete"] = mapCacheDelete;
        MapCache.prototype.get = mapCacheGet;
        MapCache.prototype.has = mapCacheHas;
        MapCache.prototype.set = mapCacheSet;

        function SetCache(values2) {
          var index7 = -1, length = values2 == null ? 0 : values2.length;
          this.__data__ = new MapCache();
          while (++index7 < length) {
            this.add(values2[index7]);
          }
        }

        function setCacheAdd(value) {
          this.__data__.set(value, HASH_UNDEFINED);
          return this;
        }

        function setCacheHas(value) {
          return this.__data__.has(value);
        }

        SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
        SetCache.prototype.has = setCacheHas;

        function Stack(entries) {
          var data = this.__data__ = new ListCache(entries);
          this.size = data.size;
        }

        function stackClear() {
          this.__data__ = new ListCache();
          this.size = 0;
        }

        function stackDelete(key2) {
          var data = this.__data__, result2 = data["delete"](key2);
          this.size = data.size;
          return result2;
        }

        function stackGet(key2) {
          return this.__data__.get(key2);
        }

        function stackHas(key2) {
          return this.__data__.has(key2);
        }

        function stackSet(key2, value) {
          var data = this.__data__;
          if (data instanceof ListCache) {
            var pairs = data.__data__;
            if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
              pairs.push([key2, value]);
              this.size = ++data.size;
              return this;
            }
            data = this.__data__ = new MapCache(pairs);
          }
          data.set(key2, value);
          this.size = data.size;
          return this;
        }

        Stack.prototype.clear = stackClear;
        Stack.prototype["delete"] = stackDelete;
        Stack.prototype.get = stackGet;
        Stack.prototype.has = stackHas;
        Stack.prototype.set = stackSet;

        function arrayLikeKeys(value, inherited) {
          var isArr = isArray(value), isArg = !isArr && isArguments(value),
            isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value),
            skipIndexes = isArr || isArg || isBuff || isType,
            result2 = skipIndexes ? baseTimes(value.length, String2) : [], length = result2.length;
          for (var key2 in value) {
            if ((inherited || hasOwnProperty.call(value, key2)) && !(skipIndexes && (key2 == "length" || isBuff && (key2 == "offset" || key2 == "parent") || isType && (key2 == "buffer" || key2 == "byteLength" || key2 == "byteOffset") || isIndex(key2, length)))) {
              result2.push(key2);
            }
          }
          return result2;
        }

        function arraySample(array2) {
          var length = array2.length;
          return length ? array2[baseRandom(0, length - 1)] : undefined2;
        }

        function arraySampleSize(array2, n) {
          return shuffleSelf(copyArray(array2), baseClamp(n, 0, array2.length));
        }

        function arrayShuffle(array2) {
          return shuffleSelf(copyArray(array2));
        }

        function assignMergeValue(object, key2, value) {
          if (value !== undefined2 && !eq(object[key2], value) || value === undefined2 && !(key2 in object)) {
            baseAssignValue(object, key2, value);
          }
        }

        function assignValue(object, key2, value) {
          var objValue = object[key2];
          if (!(hasOwnProperty.call(object, key2) && eq(objValue, value)) || value === undefined2 && !(key2 in object)) {
            baseAssignValue(object, key2, value);
          }
        }

        function assocIndexOf(array2, key2) {
          var length = array2.length;
          while (length--) {
            if (eq(array2[length][0], key2)) {
              return length;
            }
          }
          return -1;
        }

        function baseAggregator(collection, setter, iteratee2, accumulator) {
          baseEach(collection, function(value, key2, collection2) {
            setter(accumulator, value, iteratee2(value), collection2);
          });
          return accumulator;
        }

        function baseAssign(object, source) {
          return object && copyObject(source, keys(source), object);
        }

        function baseAssignIn(object, source) {
          return object && copyObject(source, keysIn(source), object);
        }

        function baseAssignValue(object, key2, value) {
          if (key2 == "__proto__" && defineProperty) {
            defineProperty(object, key2, {
              "configurable": true,
              "enumerable": true,
              "value": value,
              "writable": true
            });
          } else {
            object[key2] = value;
          }
        }

        function baseAt(object, paths) {
          var index7 = -1, length = paths.length, result2 = Array2(length), skip = object == null;
          while (++index7 < length) {
            result2[index7] = skip ? undefined2 : get(object, paths[index7]);
          }
          return result2;
        }

        function baseClamp(number, lower2, upper) {
          if (number === number) {
            if (upper !== undefined2) {
              number = number <= upper ? number : upper;
            }
            if (lower2 !== undefined2) {
              number = number >= lower2 ? number : lower2;
            }
          }
          return number;
        }

        function baseClone(value, bitmask, customizer, key2, object, stack) {
          var result2, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG,
            isFull = bitmask & CLONE_SYMBOLS_FLAG;
          if (customizer) {
            result2 = object ? customizer(value, key2, object, stack) : customizer(value);
          }
          if (result2 !== undefined2) {
            return result2;
          }
          if (!isObject(value)) {
            return value;
          }
          var isArr = isArray(value);
          if (isArr) {
            result2 = initCloneArray(value);
            if (!isDeep) {
              return copyArray(value, result2);
            }
          } else {
            var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
            if (isBuffer(value)) {
              return cloneBuffer(value, isDeep);
            }
            if (tag == objectTag || tag == argsTag || isFunc && !object) {
              result2 = isFlat || isFunc ? {} : initCloneObject(value);
              if (!isDeep) {
                return isFlat ? copySymbolsIn(value, baseAssignIn(result2, value)) : copySymbols(value, baseAssign(result2, value));
              }
            } else {
              if (!cloneableTags[tag]) {
                return object ? value : {};
              }
              result2 = initCloneByTag(value, tag, isDeep);
            }
          }
          stack || (stack = new Stack());
          var stacked = stack.get(value);
          if (stacked) {
            return stacked;
          }
          stack.set(value, result2);
          if (isSet(value)) {
            value.forEach(function(subValue) {
              result2.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
            });
          } else if (isMap(value)) {
            value.forEach(function(subValue, key3) {
              result2.set(key3, baseClone(subValue, bitmask, customizer, key3, value, stack));
            });
          }
          var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
          var props = isArr ? undefined2 : keysFunc(value);
          arrayEach(props || value, function(subValue, key3) {
            if (props) {
              key3 = subValue;
              subValue = value[key3];
            }
            assignValue(result2, key3, baseClone(subValue, bitmask, customizer, key3, value, stack));
          });
          return result2;
        }

        function baseConforms(source) {
          var props = keys(source);
          return function(object) {
            return baseConformsTo(object, source, props);
          };
        }

        function baseConformsTo(object, source, props) {
          var length = props.length;
          if (object == null) {
            return !length;
          }
          object = Object2(object);
          while (length--) {
            var key2 = props[length], predicate = source[key2], value = object[key2];
            if (value === undefined2 && !(key2 in object) || !predicate(value)) {
              return false;
            }
          }
          return true;
        }

        function baseDelay(func, wait, args) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          return setTimeout(function() {
            func.apply(undefined2, args);
          }, wait);
        }

        function baseDifference(array2, values2, iteratee2, comparator) {
          var index7 = -1, includes2 = arrayIncludes, isCommon = true, length = array2.length, result2 = [],
            valuesLength = values2.length;
          if (!length) {
            return result2;
          }
          if (iteratee2) {
            values2 = arrayMap(values2, baseUnary(iteratee2));
          }
          if (comparator) {
            includes2 = arrayIncludesWith;
            isCommon = false;
          } else if (values2.length >= LARGE_ARRAY_SIZE) {
            includes2 = cacheHas;
            isCommon = false;
            values2 = new SetCache(values2);
          }
          outer:
            while (++index7 < length) {
              var value = array2[index7], computed = iteratee2 == null ? value : iteratee2(value);
              value = comparator || value !== 0 ? value : 0;
              if (isCommon && computed === computed) {
                var valuesIndex = valuesLength;
                while (valuesIndex--) {
                  if (values2[valuesIndex] === computed) {
                    continue outer;
                  }
                }
                result2.push(value);
              } else if (!includes2(values2, computed, comparator)) {
                result2.push(value);
              }
            }
          return result2;
        }

        var baseEach = createBaseEach(baseForOwn);
        var baseEachRight = createBaseEach(baseForOwnRight, true);

        function baseEvery(collection, predicate) {
          var result2 = true;
          baseEach(collection, function(value, index7, collection2) {
            result2 = !!predicate(value, index7, collection2);
            return result2;
          });
          return result2;
        }

        function baseExtremum(array2, iteratee2, comparator) {
          var index7 = -1, length = array2.length;
          while (++index7 < length) {
            var value = array2[index7], current = iteratee2(value);
            if (current != null && (computed === undefined2 ? current === current && !isSymbol(current) : comparator(current, computed))) {
              var computed = current, result2 = value;
            }
          }
          return result2;
        }

        function baseFill(array2, value, start, end) {
          var length = array2.length;
          start = toInteger(start);
          if (start < 0) {
            start = -start > length ? 0 : length + start;
          }
          end = end === undefined2 || end > length ? length : toInteger(end);
          if (end < 0) {
            end += length;
          }
          end = start > end ? 0 : toLength(end);
          while (start < end) {
            array2[start++] = value;
          }
          return array2;
        }

        function baseFilter(collection, predicate) {
          var result2 = [];
          baseEach(collection, function(value, index7, collection2) {
            if (predicate(value, index7, collection2)) {
              result2.push(value);
            }
          });
          return result2;
        }

        function baseFlatten(array2, depth, predicate, isStrict, result2) {
          var index7 = -1, length = array2.length;
          predicate || (predicate = isFlattenable);
          result2 || (result2 = []);
          while (++index7 < length) {
            var value = array2[index7];
            if (depth > 0 && predicate(value)) {
              if (depth > 1) {
                baseFlatten(value, depth - 1, predicate, isStrict, result2);
              } else {
                arrayPush(result2, value);
              }
            } else if (!isStrict) {
              result2[result2.length] = value;
            }
          }
          return result2;
        }

        var baseFor = createBaseFor();
        var baseForRight = createBaseFor(true);

        function baseForOwn(object, iteratee2) {
          return object && baseFor(object, iteratee2, keys);
        }

        function baseForOwnRight(object, iteratee2) {
          return object && baseForRight(object, iteratee2, keys);
        }

        function baseFunctions(object, props) {
          return arrayFilter(props, function(key2) {
            return isFunction(object[key2]);
          });
        }

        function baseGet(object, path) {
          path = castPath(path, object);
          var index7 = 0, length = path.length;
          while (object != null && index7 < length) {
            object = object[toKey(path[index7++])];
          }
          return index7 && index7 == length ? object : undefined2;
        }

        function baseGetAllKeys(object, keysFunc, symbolsFunc) {
          var result2 = keysFunc(object);
          return isArray(object) ? result2 : arrayPush(result2, symbolsFunc(object));
        }

        function baseGetTag(value) {
          if (value == null) {
            return value === undefined2 ? undefinedTag : nullTag;
          }
          return symToStringTag && symToStringTag in Object2(value) ? getRawTag(value) : objectToString(value);
        }

        function baseGt(value, other) {
          return value > other;
        }

        function baseHas(object, key2) {
          return object != null && hasOwnProperty.call(object, key2);
        }

        function baseHasIn(object, key2) {
          return object != null && key2 in Object2(object);
        }

        function baseInRange(number, start, end) {
          return number >= nativeMin(start, end) && number < nativeMax(start, end);
        }

        function baseIntersection(arrays, iteratee2, comparator) {
          var includes2 = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length,
            othLength = arrays.length, othIndex = othLength, caches = Array2(othLength), maxLength = Infinity,
            result2 = [];
          while (othIndex--) {
            var array2 = arrays[othIndex];
            if (othIndex && iteratee2) {
              array2 = arrayMap(array2, baseUnary(iteratee2));
            }
            maxLength = nativeMin(array2.length, maxLength);
            caches[othIndex] = !comparator && (iteratee2 || length >= 120 && array2.length >= 120) ? new SetCache(othIndex && array2) : undefined2;
          }
          array2 = arrays[0];
          var index7 = -1, seen = caches[0];
          outer:
            while (++index7 < length && result2.length < maxLength) {
              var value = array2[index7], computed = iteratee2 ? iteratee2(value) : value;
              value = comparator || value !== 0 ? value : 0;
              if (!(seen ? cacheHas(seen, computed) : includes2(result2, computed, comparator))) {
                othIndex = othLength;
                while (--othIndex) {
                  var cache = caches[othIndex];
                  if (!(cache ? cacheHas(cache, computed) : includes2(arrays[othIndex], computed, comparator))) {
                    continue outer;
                  }
                }
                if (seen) {
                  seen.push(computed);
                }
                result2.push(value);
              }
            }
          return result2;
        }

        function baseInverter(object, setter, iteratee2, accumulator) {
          baseForOwn(object, function(value, key2, object2) {
            setter(accumulator, iteratee2(value), key2, object2);
          });
          return accumulator;
        }

        function baseInvoke(object, path, args) {
          path = castPath(path, object);
          object = parent(object, path);
          var func = object == null ? object : object[toKey(last(path))];
          return func == null ? undefined2 : apply(func, object, args);
        }

        function baseIsArguments(value) {
          return isObjectLike(value) && baseGetTag(value) == argsTag;
        }

        function baseIsArrayBuffer(value) {
          return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
        }

        function baseIsDate(value) {
          return isObjectLike(value) && baseGetTag(value) == dateTag;
        }

        function baseIsEqual(value, other, bitmask, customizer, stack) {
          if (value === other) {
            return true;
          }
          if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
            return value !== value && other !== other;
          }
          return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
        }

        function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
          var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object),
            othTag = othIsArr ? arrayTag : getTag(other);
          objTag = objTag == argsTag ? objectTag : objTag;
          othTag = othTag == argsTag ? objectTag : othTag;
          var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
          if (isSameTag && isBuffer(object)) {
            if (!isBuffer(other)) {
              return false;
            }
            objIsArr = true;
            objIsObj = false;
          }
          if (isSameTag && !objIsObj) {
            stack || (stack = new Stack());
            return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
          }
          if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
            var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"),
              othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
            if (objIsWrapped || othIsWrapped) {
              var objUnwrapped = objIsWrapped ? object.value() : object,
                othUnwrapped = othIsWrapped ? other.value() : other;
              stack || (stack = new Stack());
              return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
            }
          }
          if (!isSameTag) {
            return false;
          }
          stack || (stack = new Stack());
          return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
        }

        function baseIsMap(value) {
          return isObjectLike(value) && getTag(value) == mapTag;
        }

        function baseIsMatch(object, source, matchData, customizer) {
          var index7 = matchData.length, length = index7, noCustomizer = !customizer;
          if (object == null) {
            return !length;
          }
          object = Object2(object);
          while (index7--) {
            var data = matchData[index7];
            if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
              return false;
            }
          }
          while (++index7 < length) {
            data = matchData[index7];
            var key2 = data[0], objValue = object[key2], srcValue = data[1];
            if (noCustomizer && data[2]) {
              if (objValue === undefined2 && !(key2 in object)) {
                return false;
              }
            } else {
              var stack = new Stack();
              if (customizer) {
                var result2 = customizer(objValue, srcValue, key2, object, source, stack);
              }
              if (!(result2 === undefined2 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result2)) {
                return false;
              }
            }
          }
          return true;
        }

        function baseIsNative(value) {
          if (!isObject(value) || isMasked(value)) {
            return false;
          }
          var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
          return pattern.test(toSource(value));
        }

        function baseIsRegExp(value) {
          return isObjectLike(value) && baseGetTag(value) == regexpTag;
        }

        function baseIsSet(value) {
          return isObjectLike(value) && getTag(value) == setTag;
        }

        function baseIsTypedArray(value) {
          return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
        }

        function baseIteratee(value) {
          if (typeof value == "function") {
            return value;
          }
          if (value == null) {
            return identity;
          }
          if (typeof value == "object") {
            return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
          }
          return property(value);
        }

        function baseKeys(object) {
          if (!isPrototype(object)) {
            return nativeKeys(object);
          }
          var result2 = [];
          for (var key2 in Object2(object)) {
            if (hasOwnProperty.call(object, key2) && key2 != "constructor") {
              result2.push(key2);
            }
          }
          return result2;
        }

        function baseKeysIn(object) {
          if (!isObject(object)) {
            return nativeKeysIn(object);
          }
          var isProto = isPrototype(object), result2 = [];
          for (var key2 in object) {
            if (!(key2 == "constructor" && (isProto || !hasOwnProperty.call(object, key2)))) {
              result2.push(key2);
            }
          }
          return result2;
        }

        function baseLt(value, other) {
          return value < other;
        }

        function baseMap(collection, iteratee2) {
          var index7 = -1, result2 = isArrayLike(collection) ? Array2(collection.length) : [];
          baseEach(collection, function(value, key2, collection2) {
            result2[++index7] = iteratee2(value, key2, collection2);
          });
          return result2;
        }

        function baseMatches(source) {
          var matchData = getMatchData(source);
          if (matchData.length == 1 && matchData[0][2]) {
            return matchesStrictComparable(matchData[0][0], matchData[0][1]);
          }
          return function(object) {
            return object === source || baseIsMatch(object, source, matchData);
          };
        }

        function baseMatchesProperty(path, srcValue) {
          if (isKey(path) && isStrictComparable(srcValue)) {
            return matchesStrictComparable(toKey(path), srcValue);
          }
          return function(object) {
            var objValue = get(object, path);
            return objValue === undefined2 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
          };
        }

        function baseMerge(object, source, srcIndex, customizer, stack) {
          if (object === source) {
            return;
          }
          baseFor(source, function(srcValue, key2) {
            stack || (stack = new Stack());
            if (isObject(srcValue)) {
              baseMergeDeep(object, source, key2, srcIndex, baseMerge, customizer, stack);
            } else {
              var newValue = customizer ? customizer(safeGet(object, key2), srcValue, key2 + "", object, source, stack) : undefined2;
              if (newValue === undefined2) {
                newValue = srcValue;
              }
              assignMergeValue(object, key2, newValue);
            }
          }, keysIn);
        }

        function baseMergeDeep(object, source, key2, srcIndex, mergeFunc, customizer, stack) {
          var objValue = safeGet(object, key2), srcValue = safeGet(source, key2), stacked = stack.get(srcValue);
          if (stacked) {
            assignMergeValue(object, key2, stacked);
            return;
          }
          var newValue = customizer ? customizer(objValue, srcValue, key2 + "", object, source, stack) : undefined2;
          var isCommon = newValue === undefined2;
          if (isCommon) {
            var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue),
              isTyped = !isArr && !isBuff && isTypedArray(srcValue);
            newValue = srcValue;
            if (isArr || isBuff || isTyped) {
              if (isArray(objValue)) {
                newValue = objValue;
              } else if (isArrayLikeObject(objValue)) {
                newValue = copyArray(objValue);
              } else if (isBuff) {
                isCommon = false;
                newValue = cloneBuffer(srcValue, true);
              } else if (isTyped) {
                isCommon = false;
                newValue = cloneTypedArray(srcValue, true);
              } else {
                newValue = [];
              }
            } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
              newValue = objValue;
              if (isArguments(objValue)) {
                newValue = toPlainObject(objValue);
              } else if (!isObject(objValue) || isFunction(objValue)) {
                newValue = initCloneObject(srcValue);
              }
            } else {
              isCommon = false;
            }
          }
          if (isCommon) {
            stack.set(srcValue, newValue);
            mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
            stack["delete"](srcValue);
          }
          assignMergeValue(object, key2, newValue);
        }

        function baseNth(array2, n) {
          var length = array2.length;
          if (!length) {
            return;
          }
          n += n < 0 ? length : 0;
          return isIndex(n, length) ? array2[n] : undefined2;
        }

        function baseOrderBy(collection, iteratees, orders) {
          if (iteratees.length) {
            iteratees = arrayMap(iteratees, function(iteratee2) {
              if (isArray(iteratee2)) {
                return function(value) {
                  return baseGet(value, iteratee2.length === 1 ? iteratee2[0] : iteratee2);
                };
              }
              return iteratee2;
            });
          } else {
            iteratees = [identity];
          }
          var index7 = -1;
          iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
          var result2 = baseMap(collection, function(value, key2, collection2) {
            var criteria = arrayMap(iteratees, function(iteratee2) {
              return iteratee2(value);
            });
            return { "criteria": criteria, "index": ++index7, "value": value };
          });
          return baseSortBy(result2, function(object, other) {
            return compareMultiple(object, other, orders);
          });
        }

        function basePick(object, paths) {
          return basePickBy(object, paths, function(value, path) {
            return hasIn(object, path);
          });
        }

        function basePickBy(object, paths, predicate) {
          var index7 = -1, length = paths.length, result2 = {};
          while (++index7 < length) {
            var path = paths[index7], value = baseGet(object, path);
            if (predicate(value, path)) {
              baseSet(result2, castPath(path, object), value);
            }
          }
          return result2;
        }

        function basePropertyDeep(path) {
          return function(object) {
            return baseGet(object, path);
          };
        }

        function basePullAll(array2, values2, iteratee2, comparator) {
          var indexOf2 = comparator ? baseIndexOfWith : baseIndexOf, index7 = -1, length = values2.length,
            seen = array2;
          if (array2 === values2) {
            values2 = copyArray(values2);
          }
          if (iteratee2) {
            seen = arrayMap(array2, baseUnary(iteratee2));
          }
          while (++index7 < length) {
            var fromIndex = 0, value = values2[index7], computed = iteratee2 ? iteratee2(value) : value;
            while ((fromIndex = indexOf2(seen, computed, fromIndex, comparator)) > -1) {
              if (seen !== array2) {
                splice.call(seen, fromIndex, 1);
              }
              splice.call(array2, fromIndex, 1);
            }
          }
          return array2;
        }

        function basePullAt(array2, indexes) {
          var length = array2 ? indexes.length : 0, lastIndex = length - 1;
          while (length--) {
            var index7 = indexes[length];
            if (length == lastIndex || index7 !== previous) {
              var previous = index7;
              if (isIndex(index7)) {
                splice.call(array2, index7, 1);
              } else {
                baseUnset(array2, index7);
              }
            }
          }
          return array2;
        }

        function baseRandom(lower2, upper) {
          return lower2 + nativeFloor(nativeRandom() * (upper - lower2 + 1));
        }

        function baseRange(start, end, step, fromRight) {
          var index7 = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result2 = Array2(length);
          while (length--) {
            result2[fromRight ? length : ++index7] = start;
            start += step;
          }
          return result2;
        }

        function baseRepeat(string, n) {
          var result2 = "";
          if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
            return result2;
          }
          do {
            if (n % 2) {
              result2 += string;
            }
            n = nativeFloor(n / 2);
            if (n) {
              string += string;
            }
          } while (n);
          return result2;
        }

        function baseRest(func, start) {
          return setToString(overRest(func, start, identity), func + "");
        }

        function baseSample(collection) {
          return arraySample(values(collection));
        }

        function baseSampleSize(collection, n) {
          var array2 = values(collection);
          return shuffleSelf(array2, baseClamp(n, 0, array2.length));
        }

        function baseSet(object, path, value, customizer) {
          if (!isObject(object)) {
            return object;
          }
          path = castPath(path, object);
          var index7 = -1, length = path.length, lastIndex = length - 1, nested = object;
          while (nested != null && ++index7 < length) {
            var key2 = toKey(path[index7]), newValue = value;
            if (key2 === "__proto__" || key2 === "constructor" || key2 === "prototype") {
              return object;
            }
            if (index7 != lastIndex) {
              var objValue = nested[key2];
              newValue = customizer ? customizer(objValue, key2, nested) : undefined2;
              if (newValue === undefined2) {
                newValue = isObject(objValue) ? objValue : isIndex(path[index7 + 1]) ? [] : {};
              }
            }
            assignValue(nested, key2, newValue);
            nested = nested[key2];
          }
          return object;
        }

        var baseSetData = !metaMap ? identity : function(func, data) {
          metaMap.set(func, data);
          return func;
        };
        var baseSetToString = !defineProperty ? identity : function(func, string) {
          return defineProperty(func, "toString", {
            "configurable": true,
            "enumerable": false,
            "value": constant(string),
            "writable": true
          });
        };

        function baseShuffle(collection) {
          return shuffleSelf(values(collection));
        }

        function baseSlice(array2, start, end) {
          var index7 = -1, length = array2.length;
          if (start < 0) {
            start = -start > length ? 0 : length + start;
          }
          end = end > length ? length : end;
          if (end < 0) {
            end += length;
          }
          length = start > end ? 0 : end - start >>> 0;
          start >>>= 0;
          var result2 = Array2(length);
          while (++index7 < length) {
            result2[index7] = array2[index7 + start];
          }
          return result2;
        }

        function baseSome(collection, predicate) {
          var result2;
          baseEach(collection, function(value, index7, collection2) {
            result2 = predicate(value, index7, collection2);
            return !result2;
          });
          return !!result2;
        }

        function baseSortedIndex(array2, value, retHighest) {
          var low = 0, high = array2 == null ? low : array2.length;
          if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
            while (low < high) {
              var mid = low + high >>> 1, computed = array2[mid];
              if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
                low = mid + 1;
              } else {
                high = mid;
              }
            }
            return high;
          }
          return baseSortedIndexBy(array2, value, identity, retHighest);
        }

        function baseSortedIndexBy(array2, value, iteratee2, retHighest) {
          var low = 0, high = array2 == null ? 0 : array2.length;
          if (high === 0) {
            return 0;
          }
          value = iteratee2(value);
          var valIsNaN = value !== value, valIsNull = value === null, valIsSymbol = isSymbol(value),
            valIsUndefined = value === undefined2;
          while (low < high) {
            var mid = nativeFloor((low + high) / 2), computed = iteratee2(array2[mid]),
              othIsDefined = computed !== undefined2, othIsNull = computed === null,
              othIsReflexive = computed === computed, othIsSymbol = isSymbol(computed);
            if (valIsNaN) {
              var setLow = retHighest || othIsReflexive;
            } else if (valIsUndefined) {
              setLow = othIsReflexive && (retHighest || othIsDefined);
            } else if (valIsNull) {
              setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
            } else if (valIsSymbol) {
              setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
            } else if (othIsNull || othIsSymbol) {
              setLow = false;
            } else {
              setLow = retHighest ? computed <= value : computed < value;
            }
            if (setLow) {
              low = mid + 1;
            } else {
              high = mid;
            }
          }
          return nativeMin(high, MAX_ARRAY_INDEX);
        }

        function baseSortedUniq(array2, iteratee2) {
          var index7 = -1, length = array2.length, resIndex = 0, result2 = [];
          while (++index7 < length) {
            var value = array2[index7], computed = iteratee2 ? iteratee2(value) : value;
            if (!index7 || !eq(computed, seen)) {
              var seen = computed;
              result2[resIndex++] = value === 0 ? 0 : value;
            }
          }
          return result2;
        }

        function baseToNumber(value) {
          if (typeof value == "number") {
            return value;
          }
          if (isSymbol(value)) {
            return NAN;
          }
          return +value;
        }

        function baseToString(value) {
          if (typeof value == "string") {
            return value;
          }
          if (isArray(value)) {
            return arrayMap(value, baseToString) + "";
          }
          if (isSymbol(value)) {
            return symbolToString ? symbolToString.call(value) : "";
          }
          var result2 = value + "";
          return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
        }

        function baseUniq(array2, iteratee2, comparator) {
          var index7 = -1, includes2 = arrayIncludes, length = array2.length, isCommon = true, result2 = [],
            seen = result2;
          if (comparator) {
            isCommon = false;
            includes2 = arrayIncludesWith;
          } else if (length >= LARGE_ARRAY_SIZE) {
            var set2 = iteratee2 ? null : createSet(array2);
            if (set2) {
              return setToArray(set2);
            }
            isCommon = false;
            includes2 = cacheHas;
            seen = new SetCache();
          } else {
            seen = iteratee2 ? [] : result2;
          }
          outer:
            while (++index7 < length) {
              var value = array2[index7], computed = iteratee2 ? iteratee2(value) : value;
              value = comparator || value !== 0 ? value : 0;
              if (isCommon && computed === computed) {
                var seenIndex = seen.length;
                while (seenIndex--) {
                  if (seen[seenIndex] === computed) {
                    continue outer;
                  }
                }
                if (iteratee2) {
                  seen.push(computed);
                }
                result2.push(value);
              } else if (!includes2(seen, computed, comparator)) {
                if (seen !== result2) {
                  seen.push(computed);
                }
                result2.push(value);
              }
            }
          return result2;
        }

        function baseUnset(object, path) {
          path = castPath(path, object);
          object = parent(object, path);
          return object == null || delete object[toKey(last(path))];
        }

        function baseUpdate(object, path, updater, customizer) {
          return baseSet(object, path, updater(baseGet(object, path)), customizer);
        }

        function baseWhile(array2, predicate, isDrop, fromRight) {
          var length = array2.length, index7 = fromRight ? length : -1;
          while ((fromRight ? index7-- : ++index7 < length) && predicate(array2[index7], index7, array2)) {
          }
          return isDrop ? baseSlice(array2, fromRight ? 0 : index7, fromRight ? index7 + 1 : length) : baseSlice(array2, fromRight ? index7 + 1 : 0, fromRight ? length : index7);
        }

        function baseWrapperValue(value, actions) {
          var result2 = value;
          if (result2 instanceof LazyWrapper) {
            result2 = result2.value();
          }
          return arrayReduce(actions, function(result3, action) {
            return action.func.apply(action.thisArg, arrayPush([result3], action.args));
          }, result2);
        }

        function baseXor(arrays, iteratee2, comparator) {
          var length = arrays.length;
          if (length < 2) {
            return length ? baseUniq(arrays[0]) : [];
          }
          var index7 = -1, result2 = Array2(length);
          while (++index7 < length) {
            var array2 = arrays[index7], othIndex = -1;
            while (++othIndex < length) {
              if (othIndex != index7) {
                result2[index7] = baseDifference(result2[index7] || array2, arrays[othIndex], iteratee2, comparator);
              }
            }
          }
          return baseUniq(baseFlatten(result2, 1), iteratee2, comparator);
        }

        function baseZipObject(props, values2, assignFunc) {
          var index7 = -1, length = props.length, valsLength = values2.length, result2 = {};
          while (++index7 < length) {
            var value = index7 < valsLength ? values2[index7] : undefined2;
            assignFunc(result2, props[index7], value);
          }
          return result2;
        }

        function castArrayLikeObject(value) {
          return isArrayLikeObject(value) ? value : [];
        }

        function castFunction(value) {
          return typeof value == "function" ? value : identity;
        }

        function castPath(value, object) {
          if (isArray(value)) {
            return value;
          }
          return isKey(value, object) ? [value] : stringToPath(toString(value));
        }

        var castRest = baseRest;

        function castSlice(array2, start, end) {
          var length = array2.length;
          end = end === undefined2 ? length : end;
          return !start && end >= length ? array2 : baseSlice(array2, start, end);
        }

        var clearTimeout = ctxClearTimeout || function(id) {
          return root.clearTimeout(id);
        };

        function cloneBuffer(buffer, isDeep) {
          if (isDeep) {
            return buffer.slice();
          }
          var length = buffer.length, result2 = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
          buffer.copy(result2);
          return result2;
        }

        function cloneArrayBuffer(arrayBuffer) {
          var result2 = new arrayBuffer.constructor(arrayBuffer.byteLength);
          new Uint8Array2(result2).set(new Uint8Array2(arrayBuffer));
          return result2;
        }

        function cloneDataView(dataView, isDeep) {
          var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
          return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
        }

        function cloneRegExp(regexp) {
          var result2 = new regexp.constructor(regexp.source, reFlags.exec(regexp));
          result2.lastIndex = regexp.lastIndex;
          return result2;
        }

        function cloneSymbol(symbol) {
          return symbolValueOf ? Object2(symbolValueOf.call(symbol)) : {};
        }

        function cloneTypedArray(typedArray, isDeep) {
          var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
          return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
        }

        function compareAscending(value, other) {
          if (value !== other) {
            var valIsDefined = value !== undefined2, valIsNull = value === null, valIsReflexive = value === value,
              valIsSymbol = isSymbol(value);
            var othIsDefined = other !== undefined2, othIsNull = other === null, othIsReflexive = other === other,
              othIsSymbol = isSymbol(other);
            if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
              return 1;
            }
            if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
              return -1;
            }
          }
          return 0;
        }

        function compareMultiple(object, other, orders) {
          var index7 = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length,
            ordersLength = orders.length;
          while (++index7 < length) {
            var result2 = compareAscending(objCriteria[index7], othCriteria[index7]);
            if (result2) {
              if (index7 >= ordersLength) {
                return result2;
              }
              var order = orders[index7];
              return result2 * (order == "desc" ? -1 : 1);
            }
          }
          return object.index - other.index;
        }

        function composeArgs(args, partials, holders, isCurried) {
          var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1,
            leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0),
            result2 = Array2(leftLength + rangeLength), isUncurried = !isCurried;
          while (++leftIndex < leftLength) {
            result2[leftIndex] = partials[leftIndex];
          }
          while (++argsIndex < holdersLength) {
            if (isUncurried || argsIndex < argsLength) {
              result2[holders[argsIndex]] = args[argsIndex];
            }
          }
          while (rangeLength--) {
            result2[leftIndex++] = args[argsIndex++];
          }
          return result2;
        }

        function composeArgsRight(args, partials, holders, isCurried) {
          var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length,
            rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0),
            result2 = Array2(rangeLength + rightLength), isUncurried = !isCurried;
          while (++argsIndex < rangeLength) {
            result2[argsIndex] = args[argsIndex];
          }
          var offset = argsIndex;
          while (++rightIndex < rightLength) {
            result2[offset + rightIndex] = partials[rightIndex];
          }
          while (++holdersIndex < holdersLength) {
            if (isUncurried || argsIndex < argsLength) {
              result2[offset + holders[holdersIndex]] = args[argsIndex++];
            }
          }
          return result2;
        }

        function copyArray(source, array2) {
          var index7 = -1, length = source.length;
          array2 || (array2 = Array2(length));
          while (++index7 < length) {
            array2[index7] = source[index7];
          }
          return array2;
        }

        function copyObject(source, props, object, customizer) {
          var isNew = !object;
          object || (object = {});
          var index7 = -1, length = props.length;
          while (++index7 < length) {
            var key2 = props[index7];
            var newValue = customizer ? customizer(object[key2], source[key2], key2, object, source) : undefined2;
            if (newValue === undefined2) {
              newValue = source[key2];
            }
            if (isNew) {
              baseAssignValue(object, key2, newValue);
            } else {
              assignValue(object, key2, newValue);
            }
          }
          return object;
        }

        function copySymbols(source, object) {
          return copyObject(source, getSymbols(source), object);
        }

        function copySymbolsIn(source, object) {
          return copyObject(source, getSymbolsIn(source), object);
        }

        function createAggregator(setter, initializer) {
          return function(collection, iteratee2) {
            var func = isArray(collection) ? arrayAggregator : baseAggregator,
              accumulator = initializer ? initializer() : {};
            return func(collection, setter, getIteratee(iteratee2, 2), accumulator);
          };
        }

        function createAssigner(assigner) {
          return baseRest(function(object, sources) {
            var index7 = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : undefined2,
              guard = length > 2 ? sources[2] : undefined2;
            customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : undefined2;
            if (guard && isIterateeCall(sources[0], sources[1], guard)) {
              customizer = length < 3 ? undefined2 : customizer;
              length = 1;
            }
            object = Object2(object);
            while (++index7 < length) {
              var source = sources[index7];
              if (source) {
                assigner(object, source, index7, customizer);
              }
            }
            return object;
          });
        }

        function createBaseEach(eachFunc, fromRight) {
          return function(collection, iteratee2) {
            if (collection == null) {
              return collection;
            }
            if (!isArrayLike(collection)) {
              return eachFunc(collection, iteratee2);
            }
            var length = collection.length, index7 = fromRight ? length : -1, iterable = Object2(collection);
            while (fromRight ? index7-- : ++index7 < length) {
              if (iteratee2(iterable[index7], index7, iterable) === false) {
                break;
              }
            }
            return collection;
          };
        }

        function createBaseFor(fromRight) {
          return function(object, iteratee2, keysFunc) {
            var index7 = -1, iterable = Object2(object), props = keysFunc(object), length = props.length;
            while (length--) {
              var key2 = props[fromRight ? length : ++index7];
              if (iteratee2(iterable[key2], key2, iterable) === false) {
                break;
              }
            }
            return object;
          };
        }

        function createBind(func, bitmask, thisArg) {
          var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);

          function wrapper() {
            var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            return fn.apply(isBind ? thisArg : this, arguments);
          }

          return wrapper;
        }

        function createCaseFirst(methodName) {
          return function(string) {
            string = toString(string);
            var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined2;
            var chr = strSymbols ? strSymbols[0] : string.charAt(0);
            var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
            return chr[methodName]() + trailing;
          };
        }

        function createCompounder(callback) {
          return function(string) {
            return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
          };
        }

        function createCtor(Ctor) {
          return function() {
            var args = arguments;
            switch (args.length) {
              case 0:
                return new Ctor();
              case 1:
                return new Ctor(args[0]);
              case 2:
                return new Ctor(args[0], args[1]);
              case 3:
                return new Ctor(args[0], args[1], args[2]);
              case 4:
                return new Ctor(args[0], args[1], args[2], args[3]);
              case 5:
                return new Ctor(args[0], args[1], args[2], args[3], args[4]);
              case 6:
                return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
              case 7:
                return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            }
            var thisBinding = baseCreate(Ctor.prototype), result2 = Ctor.apply(thisBinding, args);
            return isObject(result2) ? result2 : thisBinding;
          };
        }

        function createCurry(func, bitmask, arity) {
          var Ctor = createCtor(func);

          function wrapper() {
            var length = arguments.length, args = Array2(length), index7 = length, placeholder = getHolder(wrapper);
            while (index7--) {
              args[index7] = arguments[index7];
            }
            var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
            length -= holders.length;
            if (length < arity) {
              return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, undefined2, args, holders, undefined2, undefined2, arity - length);
            }
            var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            return apply(fn, this, args);
          }

          return wrapper;
        }

        function createFind(findIndexFunc) {
          return function(collection, predicate, fromIndex) {
            var iterable = Object2(collection);
            if (!isArrayLike(collection)) {
              var iteratee2 = getIteratee(predicate, 3);
              collection = keys(collection);
              predicate = function(key2) {
                return iteratee2(iterable[key2], key2, iterable);
              };
            }
            var index7 = findIndexFunc(collection, predicate, fromIndex);
            return index7 > -1 ? iterable[iteratee2 ? collection[index7] : index7] : undefined2;
          };
        }

        function createFlow(fromRight) {
          return flatRest(function(funcs) {
            var length = funcs.length, index7 = length, prereq = LodashWrapper.prototype.thru;
            if (fromRight) {
              funcs.reverse();
            }
            while (index7--) {
              var func = funcs[index7];
              if (typeof func != "function") {
                throw new TypeError2(FUNC_ERROR_TEXT);
              }
              if (prereq && !wrapper && getFuncName(func) == "wrapper") {
                var wrapper = new LodashWrapper([], true);
              }
            }
            index7 = wrapper ? index7 : length;
            while (++index7 < length) {
              func = funcs[index7];
              var funcName = getFuncName(func), data = funcName == "wrapper" ? getData(func) : undefined2;
              if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) {
                wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
              } else {
                wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
              }
            }
            return function() {
              var args = arguments, value = args[0];
              if (wrapper && args.length == 1 && isArray(value)) {
                return wrapper.plant(value).value();
              }
              var index8 = 0, result2 = length ? funcs[index8].apply(this, args) : value;
              while (++index8 < length) {
                result2 = funcs[index8].call(this, result2);
              }
              return result2;
            };
          });
        }

        function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary2, arity) {
          var isAry = bitmask & WRAP_ARY_FLAG, isBind = bitmask & WRAP_BIND_FLAG,
            isBindKey = bitmask & WRAP_BIND_KEY_FLAG, isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
            isFlip = bitmask & WRAP_FLIP_FLAG, Ctor = isBindKey ? undefined2 : createCtor(func);

          function wrapper() {
            var length = arguments.length, args = Array2(length), index7 = length;
            while (index7--) {
              args[index7] = arguments[index7];
            }
            if (isCurried) {
              var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
            }
            if (partials) {
              args = composeArgs(args, partials, holders, isCurried);
            }
            if (partialsRight) {
              args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
            }
            length -= holdersCount;
            if (isCurried && length < arity) {
              var newHolders = replaceHolders(args, placeholder);
              return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary2, arity - length);
            }
            var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
            length = args.length;
            if (argPos) {
              args = reorder(args, argPos);
            } else if (isFlip && length > 1) {
              args.reverse();
            }
            if (isAry && ary2 < length) {
              args.length = ary2;
            }
            if (this && this !== root && this instanceof wrapper) {
              fn = Ctor || createCtor(fn);
            }
            return fn.apply(thisBinding, args);
          }

          return wrapper;
        }

        function createInverter(setter, toIteratee) {
          return function(object, iteratee2) {
            return baseInverter(object, setter, toIteratee(iteratee2), {});
          };
        }

        function createMathOperation(operator, defaultValue) {
          return function(value, other) {
            var result2;
            if (value === undefined2 && other === undefined2) {
              return defaultValue;
            }
            if (value !== undefined2) {
              result2 = value;
            }
            if (other !== undefined2) {
              if (result2 === undefined2) {
                return other;
              }
              if (typeof value == "string" || typeof other == "string") {
                value = baseToString(value);
                other = baseToString(other);
              } else {
                value = baseToNumber(value);
                other = baseToNumber(other);
              }
              result2 = operator(value, other);
            }
            return result2;
          };
        }

        function createOver(arrayFunc) {
          return flatRest(function(iteratees) {
            iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
            return baseRest(function(args) {
              var thisArg = this;
              return arrayFunc(iteratees, function(iteratee2) {
                return apply(iteratee2, thisArg, args);
              });
            });
          });
        }

        function createPadding(length, chars2) {
          chars2 = chars2 === undefined2 ? " " : baseToString(chars2);
          var charsLength = chars2.length;
          if (charsLength < 2) {
            return charsLength ? baseRepeat(chars2, length) : chars2;
          }
          var result2 = baseRepeat(chars2, nativeCeil(length / stringSize(chars2)));
          return hasUnicode(chars2) ? castSlice(stringToArray(result2), 0, length).join("") : result2.slice(0, length);
        }

        function createPartial(func, bitmask, thisArg, partials) {
          var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);

          function wrapper() {
            var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length,
              args = Array2(leftLength + argsLength),
              fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            while (++leftIndex < leftLength) {
              args[leftIndex] = partials[leftIndex];
            }
            while (argsLength--) {
              args[leftIndex++] = arguments[++argsIndex];
            }
            return apply(fn, isBind ? thisArg : this, args);
          }

          return wrapper;
        }

        function createRange(fromRight) {
          return function(start, end, step) {
            if (step && typeof step != "number" && isIterateeCall(start, end, step)) {
              end = step = undefined2;
            }
            start = toFinite(start);
            if (end === undefined2) {
              end = start;
              start = 0;
            } else {
              end = toFinite(end);
            }
            step = step === undefined2 ? start < end ? 1 : -1 : toFinite(step);
            return baseRange(start, end, step, fromRight);
          };
        }

        function createRelationalOperation(operator) {
          return function(value, other) {
            if (!(typeof value == "string" && typeof other == "string")) {
              value = toNumber(value);
              other = toNumber(other);
            }
            return operator(value, other);
          };
        }

        function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary2, arity) {
          var isCurry = bitmask & WRAP_CURRY_FLAG, newHolders = isCurry ? holders : undefined2,
            newHoldersRight = isCurry ? undefined2 : holders, newPartials = isCurry ? partials : undefined2,
            newPartialsRight = isCurry ? undefined2 : partials;
          bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
          bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
          if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
            bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
          }
          var newData = [
            func,
            bitmask,
            thisArg,
            newPartials,
            newHolders,
            newPartialsRight,
            newHoldersRight,
            argPos,
            ary2,
            arity
          ];
          var result2 = wrapFunc.apply(undefined2, newData);
          if (isLaziable(func)) {
            setData(result2, newData);
          }
          result2.placeholder = placeholder;
          return setWrapToString(result2, func, bitmask);
        }

        function createRound(methodName) {
          var func = Math2[methodName];
          return function(number, precision) {
            number = toNumber(number);
            precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
            if (precision && nativeIsFinite(number)) {
              var pair = (toString(number) + "e").split("e"), value = func(pair[0] + "e" + (+pair[1] + precision));
              pair = (toString(value) + "e").split("e");
              return +(pair[0] + "e" + (+pair[1] - precision));
            }
            return func(number);
          };
        }

        var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop4 : function(values2) {
          return new Set2(values2);
        };

        function createToPairs(keysFunc) {
          return function(object) {
            var tag = getTag(object);
            if (tag == mapTag) {
              return mapToArray(object);
            }
            if (tag == setTag) {
              return setToPairs(object);
            }
            return baseToPairs(object, keysFunc(object));
          };
        }

        function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary2, arity) {
          var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
          if (!isBindKey && typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          var length = partials ? partials.length : 0;
          if (!length) {
            bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
            partials = holders = undefined2;
          }
          ary2 = ary2 === undefined2 ? ary2 : nativeMax(toInteger(ary2), 0);
          arity = arity === undefined2 ? arity : toInteger(arity);
          length -= holders ? holders.length : 0;
          if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
            var partialsRight = partials, holdersRight = holders;
            partials = holders = undefined2;
          }
          var data = isBindKey ? undefined2 : getData(func);
          var newData = [
            func,
            bitmask,
            thisArg,
            partials,
            holders,
            partialsRight,
            holdersRight,
            argPos,
            ary2,
            arity
          ];
          if (data) {
            mergeData(newData, data);
          }
          func = newData[0];
          bitmask = newData[1];
          thisArg = newData[2];
          partials = newData[3];
          holders = newData[4];
          arity = newData[9] = newData[9] === undefined2 ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);
          if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
            bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
          }
          if (!bitmask || bitmask == WRAP_BIND_FLAG) {
            var result2 = createBind(func, bitmask, thisArg);
          } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
            result2 = createCurry(func, bitmask, arity);
          } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
            result2 = createPartial(func, bitmask, thisArg, partials);
          } else {
            result2 = createHybrid.apply(undefined2, newData);
          }
          var setter = data ? baseSetData : setData;
          return setWrapToString(setter(result2, newData), func, bitmask);
        }

        function customDefaultsAssignIn(objValue, srcValue, key2, object) {
          if (objValue === undefined2 || eq(objValue, objectProto[key2]) && !hasOwnProperty.call(object, key2)) {
            return srcValue;
          }
          return objValue;
        }

        function customDefaultsMerge(objValue, srcValue, key2, object, source, stack) {
          if (isObject(objValue) && isObject(srcValue)) {
            stack.set(srcValue, objValue);
            baseMerge(objValue, srcValue, undefined2, customDefaultsMerge, stack);
            stack["delete"](srcValue);
          }
          return objValue;
        }

        function customOmitClone(value) {
          return isPlainObject(value) ? undefined2 : value;
        }

        function equalArrays(array2, other, bitmask, customizer, equalFunc, stack) {
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array2.length, othLength = other.length;
          if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
            return false;
          }
          var arrStacked = stack.get(array2);
          var othStacked = stack.get(other);
          if (arrStacked && othStacked) {
            return arrStacked == other && othStacked == array2;
          }
          var index7 = -1, result2 = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined2;
          stack.set(array2, other);
          stack.set(other, array2);
          while (++index7 < arrLength) {
            var arrValue = array2[index7], othValue = other[index7];
            if (customizer) {
              var compared = isPartial ? customizer(othValue, arrValue, index7, other, array2, stack) : customizer(arrValue, othValue, index7, array2, other, stack);
            }
            if (compared !== undefined2) {
              if (compared) {
                continue;
              }
              result2 = false;
              break;
            }
            if (seen) {
              if (!arraySome(other, function(othValue2, othIndex) {
                if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
                result2 = false;
                break;
              }
            } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              result2 = false;
              break;
            }
          }
          stack["delete"](array2);
          stack["delete"](other);
          return result2;
        }

        function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
          switch (tag) {
            case dataViewTag:
              if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
                return false;
              }
              object = object.buffer;
              other = other.buffer;
            case arrayBufferTag:
              if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
                return false;
              }
              return true;
            case boolTag:
            case dateTag:
            case numberTag:
              return eq(+object, +other);
            case errorTag:
              return object.name == other.name && object.message == other.message;
            case regexpTag:
            case stringTag:
              return object == other + "";
            case mapTag:
              var convert = mapToArray;
            case setTag:
              var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
              convert || (convert = setToArray);
              if (object.size != other.size && !isPartial) {
                return false;
              }
              var stacked = stack.get(object);
              if (stacked) {
                return stacked == other;
              }
              bitmask |= COMPARE_UNORDERED_FLAG;
              stack.set(object, other);
              var result2 = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
              stack["delete"](object);
              return result2;
            case symbolTag:
              if (symbolValueOf) {
                return symbolValueOf.call(object) == symbolValueOf.call(other);
              }
          }
          return false;
        }

        function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length,
            othProps = getAllKeys(other), othLength = othProps.length;
          if (objLength != othLength && !isPartial) {
            return false;
          }
          var index7 = objLength;
          while (index7--) {
            var key2 = objProps[index7];
            if (!(isPartial ? key2 in other : hasOwnProperty.call(other, key2))) {
              return false;
            }
          }
          var objStacked = stack.get(object);
          var othStacked = stack.get(other);
          if (objStacked && othStacked) {
            return objStacked == other && othStacked == object;
          }
          var result2 = true;
          stack.set(object, other);
          stack.set(other, object);
          var skipCtor = isPartial;
          while (++index7 < objLength) {
            key2 = objProps[index7];
            var objValue = object[key2], othValue = other[key2];
            if (customizer) {
              var compared = isPartial ? customizer(othValue, objValue, key2, other, object, stack) : customizer(objValue, othValue, key2, object, other, stack);
            }
            if (!(compared === undefined2 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
              result2 = false;
              break;
            }
            skipCtor || (skipCtor = key2 == "constructor");
          }
          if (result2 && !skipCtor) {
            var objCtor = object.constructor, othCtor = other.constructor;
            if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
              result2 = false;
            }
          }
          stack["delete"](object);
          stack["delete"](other);
          return result2;
        }

        function flatRest(func) {
          return setToString(overRest(func, undefined2, flatten), func + "");
        }

        function getAllKeys(object) {
          return baseGetAllKeys(object, keys, getSymbols);
        }

        function getAllKeysIn(object) {
          return baseGetAllKeys(object, keysIn, getSymbolsIn);
        }

        var getData = !metaMap ? noop4 : function(func) {
          return metaMap.get(func);
        };

        function getFuncName(func) {
          var result2 = func.name + "", array2 = realNames[result2],
            length = hasOwnProperty.call(realNames, result2) ? array2.length : 0;
          while (length--) {
            var data = array2[length], otherFunc = data.func;
            if (otherFunc == null || otherFunc == func) {
              return data.name;
            }
          }
          return result2;
        }

        function getHolder(func) {
          var object = hasOwnProperty.call(lodash, "placeholder") ? lodash : func;
          return object.placeholder;
        }

        function getIteratee() {
          var result2 = lodash.iteratee || iteratee;
          result2 = result2 === iteratee ? baseIteratee : result2;
          return arguments.length ? result2(arguments[0], arguments[1]) : result2;
        }

        function getMapData(map2, key2) {
          var data = map2.__data__;
          return isKeyable(key2) ? data[typeof key2 == "string" ? "string" : "hash"] : data.map;
        }

        function getMatchData(object) {
          var result2 = keys(object), length = result2.length;
          while (length--) {
            var key2 = result2[length], value = object[key2];
            result2[length] = [key2, value, isStrictComparable(value)];
          }
          return result2;
        }

        function getNative(object, key2) {
          var value = getValue(object, key2);
          return baseIsNative(value) ? value : undefined2;
        }

        function getRawTag(value) {
          var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
          try {
            value[symToStringTag] = undefined2;
            var unmasked = true;
          } catch (e2) {
          }
          var result2 = nativeObjectToString.call(value);
          if (unmasked) {
            if (isOwn) {
              value[symToStringTag] = tag;
            } else {
              delete value[symToStringTag];
            }
          }
          return result2;
        }

        var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
          if (object == null) {
            return [];
          }
          object = Object2(object);
          return arrayFilter(nativeGetSymbols(object), function(symbol) {
            return propertyIsEnumerable.call(object, symbol);
          });
        };
        var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
          var result2 = [];
          while (object) {
            arrayPush(result2, getSymbols(object));
            object = getPrototype(object);
          }
          return result2;
        };
        var getTag = baseGetTag;
        if (DataView2 && getTag(new DataView2(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
          getTag = function(value) {
            var result2 = baseGetTag(value), Ctor = result2 == objectTag ? value.constructor : undefined2,
              ctorString = Ctor ? toSource(Ctor) : "";
            if (ctorString) {
              switch (ctorString) {
                case dataViewCtorString:
                  return dataViewTag;
                case mapCtorString:
                  return mapTag;
                case promiseCtorString:
                  return promiseTag;
                case setCtorString:
                  return setTag;
                case weakMapCtorString:
                  return weakMapTag;
              }
            }
            return result2;
          };
        }

        function getView(start, end, transforms) {
          var index7 = -1, length = transforms.length;
          while (++index7 < length) {
            var data = transforms[index7], size2 = data.size;
            switch (data.type) {
              case "drop":
                start += size2;
                break;
              case "dropRight":
                end -= size2;
                break;
              case "take":
                end = nativeMin(end, start + size2);
                break;
              case "takeRight":
                start = nativeMax(start, end - size2);
                break;
            }
          }
          return { "start": start, "end": end };
        }

        function getWrapDetails(source) {
          var match = source.match(reWrapDetails);
          return match ? match[1].split(reSplitDetails) : [];
        }

        function hasPath(object, path, hasFunc) {
          path = castPath(path, object);
          var index7 = -1, length = path.length, result2 = false;
          while (++index7 < length) {
            var key2 = toKey(path[index7]);
            if (!(result2 = object != null && hasFunc(object, key2))) {
              break;
            }
            object = object[key2];
          }
          if (result2 || ++index7 != length) {
            return result2;
          }
          length = object == null ? 0 : object.length;
          return !!length && isLength(length) && isIndex(key2, length) && (isArray(object) || isArguments(object));
        }

        function initCloneArray(array2) {
          var length = array2.length, result2 = new array2.constructor(length);
          if (length && typeof array2[0] == "string" && hasOwnProperty.call(array2, "index")) {
            result2.index = array2.index;
            result2.input = array2.input;
          }
          return result2;
        }

        function initCloneObject(object) {
          return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
        }

        function initCloneByTag(object, tag, isDeep) {
          var Ctor = object.constructor;
          switch (tag) {
            case arrayBufferTag:
              return cloneArrayBuffer(object);
            case boolTag:
            case dateTag:
              return new Ctor(+object);
            case dataViewTag:
              return cloneDataView(object, isDeep);
            case float32Tag:
            case float64Tag:
            case int8Tag:
            case int16Tag:
            case int32Tag:
            case uint8Tag:
            case uint8ClampedTag:
            case uint16Tag:
            case uint32Tag:
              return cloneTypedArray(object, isDeep);
            case mapTag:
              return new Ctor();
            case numberTag:
            case stringTag:
              return new Ctor(object);
            case regexpTag:
              return cloneRegExp(object);
            case setTag:
              return new Ctor();
            case symbolTag:
              return cloneSymbol(object);
          }
        }

        function insertWrapDetails(source, details) {
          var length = details.length;
          if (!length) {
            return source;
          }
          var lastIndex = length - 1;
          details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
          details = details.join(length > 2 ? ", " : " ");
          return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
        }

        function isFlattenable(value) {
          return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
        }

        function isIndex(value, length) {
          var type = typeof value;
          length = length == null ? MAX_SAFE_INTEGER : length;
          return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
        }

        function isIterateeCall(value, index7, object) {
          if (!isObject(object)) {
            return false;
          }
          var type = typeof index7;
          if (type == "number" ? isArrayLike(object) && isIndex(index7, object.length) : type == "string" && index7 in object) {
            return eq(object[index7], value);
          }
          return false;
        }

        function isKey(value, object) {
          if (isArray(value)) {
            return false;
          }
          var type = typeof value;
          if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
            return true;
          }
          return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object2(object);
        }

        function isKeyable(value) {
          var type = typeof value;
          return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
        }

        function isLaziable(func) {
          var funcName = getFuncName(func), other = lodash[funcName];
          if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) {
            return false;
          }
          if (func === other) {
            return true;
          }
          var data = getData(other);
          return !!data && func === data[0];
        }

        function isMasked(func) {
          return !!maskSrcKey && maskSrcKey in func;
        }

        var isMaskable = coreJsData ? isFunction : stubFalse;

        function isPrototype(value) {
          var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
          return value === proto;
        }

        function isStrictComparable(value) {
          return value === value && !isObject(value);
        }

        function matchesStrictComparable(key2, srcValue) {
          return function(object) {
            if (object == null) {
              return false;
            }
            return object[key2] === srcValue && (srcValue !== undefined2 || key2 in Object2(object));
          };
        }

        function memoizeCapped(func) {
          var result2 = memoize(func, function(key2) {
            if (cache.size === MAX_MEMOIZE_SIZE) {
              cache.clear();
            }
            return key2;
          });
          var cache = result2.cache;
          return result2;
        }

        function mergeData(data, source) {
          var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask,
            isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
          var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;
          if (!(isCommon || isCombo)) {
            return data;
          }
          if (srcBitmask & WRAP_BIND_FLAG) {
            data[2] = source[2];
            newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
          }
          var value = source[3];
          if (value) {
            var partials = data[3];
            data[3] = partials ? composeArgs(partials, value, source[4]) : value;
            data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
          }
          value = source[5];
          if (value) {
            partials = data[5];
            data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
            data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
          }
          value = source[7];
          if (value) {
            data[7] = value;
          }
          if (srcBitmask & WRAP_ARY_FLAG) {
            data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
          }
          if (data[9] == null) {
            data[9] = source[9];
          }
          data[0] = source[0];
          data[1] = newBitmask;
          return data;
        }

        function nativeKeysIn(object) {
          var result2 = [];
          if (object != null) {
            for (var key2 in Object2(object)) {
              result2.push(key2);
            }
          }
          return result2;
        }

        function objectToString(value) {
          return nativeObjectToString.call(value);
        }

        function overRest(func, start, transform2) {
          start = nativeMax(start === undefined2 ? func.length - 1 : start, 0);
          return function() {
            var args = arguments, index7 = -1, length = nativeMax(args.length - start, 0), array2 = Array2(length);
            while (++index7 < length) {
              array2[index7] = args[start + index7];
            }
            index7 = -1;
            var otherArgs = Array2(start + 1);
            while (++index7 < start) {
              otherArgs[index7] = args[index7];
            }
            otherArgs[start] = transform2(array2);
            return apply(func, this, otherArgs);
          };
        }

        function parent(object, path) {
          return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
        }

        function reorder(array2, indexes) {
          var arrLength = array2.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray(array2);
          while (length--) {
            var index7 = indexes[length];
            array2[length] = isIndex(index7, arrLength) ? oldArray[index7] : undefined2;
          }
          return array2;
        }

        function safeGet(object, key2) {
          if (key2 === "constructor" && typeof object[key2] === "function") {
            return;
          }
          if (key2 == "__proto__") {
            return;
          }
          return object[key2];
        }

        var setData = shortOut(baseSetData);
        var setTimeout = ctxSetTimeout || function(func, wait) {
          return root.setTimeout(func, wait);
        };
        var setToString = shortOut(baseSetToString);

        function setWrapToString(wrapper, reference, bitmask) {
          var source = reference + "";
          return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
        }

        function shortOut(func) {
          var count = 0, lastCalled = 0;
          return function() {
            var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
            lastCalled = stamp;
            if (remaining > 0) {
              if (++count >= HOT_COUNT) {
                return arguments[0];
              }
            } else {
              count = 0;
            }
            return func.apply(undefined2, arguments);
          };
        }

        function shuffleSelf(array2, size2) {
          var index7 = -1, length = array2.length, lastIndex = length - 1;
          size2 = size2 === undefined2 ? length : size2;
          while (++index7 < size2) {
            var rand = baseRandom(index7, lastIndex), value = array2[rand];
            array2[rand] = array2[index7];
            array2[index7] = value;
          }
          array2.length = size2;
          return array2;
        }

        var stringToPath = memoizeCapped(function(string) {
          var result2 = [];
          if (string.charCodeAt(0) === 46) {
            result2.push("");
          }
          string.replace(rePropName, function(match, number, quote, subString) {
            result2.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
          });
          return result2;
        });

        function toKey(value) {
          if (typeof value == "string" || isSymbol(value)) {
            return value;
          }
          var result2 = value + "";
          return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
        }

        function toSource(func) {
          if (func != null) {
            try {
              return funcToString.call(func);
            } catch (e2) {
            }
            try {
              return func + "";
            } catch (e2) {
            }
          }
          return "";
        }

        function updateWrapDetails(details, bitmask) {
          arrayEach(wrapFlags, function(pair) {
            var value = "_." + pair[0];
            if (bitmask & pair[1] && !arrayIncludes(details, value)) {
              details.push(value);
            }
          });
          return details.sort();
        }

        function wrapperClone(wrapper) {
          if (wrapper instanceof LazyWrapper) {
            return wrapper.clone();
          }
          var result2 = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
          result2.__actions__ = copyArray(wrapper.__actions__);
          result2.__index__ = wrapper.__index__;
          result2.__values__ = wrapper.__values__;
          return result2;
        }

        function chunk(array2, size2, guard) {
          if (guard ? isIterateeCall(array2, size2, guard) : size2 === undefined2) {
            size2 = 1;
          } else {
            size2 = nativeMax(toInteger(size2), 0);
          }
          var length = array2 == null ? 0 : array2.length;
          if (!length || size2 < 1) {
            return [];
          }
          var index7 = 0, resIndex = 0, result2 = Array2(nativeCeil(length / size2));
          while (index7 < length) {
            result2[resIndex++] = baseSlice(array2, index7, index7 += size2);
          }
          return result2;
        }

        function compact(array2) {
          var index7 = -1, length = array2 == null ? 0 : array2.length, resIndex = 0, result2 = [];
          while (++index7 < length) {
            var value = array2[index7];
            if (value) {
              result2[resIndex++] = value;
            }
          }
          return result2;
        }

        function concat() {
          var length = arguments.length;
          if (!length) {
            return [];
          }
          var args = Array2(length - 1), array2 = arguments[0], index7 = length;
          while (index7--) {
            args[index7 - 1] = arguments[index7];
          }
          return arrayPush(isArray(array2) ? copyArray(array2) : [array2], baseFlatten(args, 1));
        }

        var difference = baseRest(function(array2, values2) {
          return isArrayLikeObject(array2) ? baseDifference(array2, baseFlatten(values2, 1, isArrayLikeObject, true)) : [];
        });
        var differenceBy = baseRest(function(array2, values2) {
          var iteratee2 = last(values2);
          if (isArrayLikeObject(iteratee2)) {
            iteratee2 = undefined2;
          }
          return isArrayLikeObject(array2) ? baseDifference(array2, baseFlatten(values2, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2)) : [];
        });
        var differenceWith = baseRest(function(array2, values2) {
          var comparator = last(values2);
          if (isArrayLikeObject(comparator)) {
            comparator = undefined2;
          }
          return isArrayLikeObject(array2) ? baseDifference(array2, baseFlatten(values2, 1, isArrayLikeObject, true), undefined2, comparator) : [];
        });

        function drop(array2, n, guard) {
          var length = array2 == null ? 0 : array2.length;
          if (!length) {
            return [];
          }
          n = guard || n === undefined2 ? 1 : toInteger(n);
          return baseSlice(array2, n < 0 ? 0 : n, length);
        }

        function dropRight(array2, n, guard) {
          var length = array2 == null ? 0 : array2.length;
          if (!length) {
            return [];
          }
          n = guard || n === undefined2 ? 1 : toInteger(n);
          n = length - n;
          return baseSlice(array2, 0, n < 0 ? 0 : n);
        }

        function dropRightWhile(array2, predicate) {
          return array2 && array2.length ? baseWhile(array2, getIteratee(predicate, 3), true, true) : [];
        }

        function dropWhile(array2, predicate) {
          return array2 && array2.length ? baseWhile(array2, getIteratee(predicate, 3), true) : [];
        }

        function fill(array2, value, start, end) {
          var length = array2 == null ? 0 : array2.length;
          if (!length) {
            return [];
          }
          if (start && typeof start != "number" && isIterateeCall(array2, value, start)) {
            start = 0;
            end = length;
          }
          return baseFill(array2, value, start, end);
        }

        function findIndex(array2, predicate, fromIndex) {
          var length = array2 == null ? 0 : array2.length;
          if (!length) {
            return -1;
          }
          var index7 = fromIndex == null ? 0 : toInteger(fromIndex);
          if (index7 < 0) {
            index7 = nativeMax(length + index7, 0);
          }
          return baseFindIndex(array2, getIteratee(predicate, 3), index7);
        }

        function findLastIndex(array2, predicate, fromIndex) {
          var length = array2 == null ? 0 : array2.length;
          if (!length) {
            return -1;
          }
          var index7 = length - 1;
          if (fromIndex !== undefined2) {
            index7 = toInteger(fromIndex);
            index7 = fromIndex < 0 ? nativeMax(length + index7, 0) : nativeMin(index7, length - 1);
          }
          return baseFindIndex(array2, getIteratee(predicate, 3), index7, true);
        }

        function flatten(array2) {
          var length = array2 == null ? 0 : array2.length;
          return length ? baseFlatten(array2, 1) : [];
        }

        function flattenDeep(array2) {
          var length = array2 == null ? 0 : array2.length;
          return length ? baseFlatten(array2, INFINITY) : [];
        }

        function flattenDepth(array2, depth) {
          var length = array2 == null ? 0 : array2.length;
          if (!length) {
            return [];
          }
          depth = depth === undefined2 ? 1 : toInteger(depth);
          return baseFlatten(array2, depth);
        }

        function fromPairs(pairs) {
          var index7 = -1, length = pairs == null ? 0 : pairs.length, result2 = {};
          while (++index7 < length) {
            var pair = pairs[index7];
            result2[pair[0]] = pair[1];
          }
          return result2;
        }

        function head(array2) {
          return array2 && array2.length ? array2[0] : undefined2;
        }

        function indexOf(array2, value, fromIndex) {
          var length = array2 == null ? 0 : array2.length;
          if (!length) {
            return -1;
          }
          var index7 = fromIndex == null ? 0 : toInteger(fromIndex);
          if (index7 < 0) {
            index7 = nativeMax(length + index7, 0);
          }
          return baseIndexOf(array2, value, index7);
        }

        function initial(array2) {
          var length = array2 == null ? 0 : array2.length;
          return length ? baseSlice(array2, 0, -1) : [];
        }

        var intersection = baseRest(function(arrays) {
          var mapped = arrayMap(arrays, castArrayLikeObject);
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
        });
        var intersectionBy = baseRest(function(arrays) {
          var iteratee2 = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
          if (iteratee2 === last(mapped)) {
            iteratee2 = undefined2;
          } else {
            mapped.pop();
          }
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee2, 2)) : [];
        });
        var intersectionWith = baseRest(function(arrays) {
          var comparator = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
          comparator = typeof comparator == "function" ? comparator : undefined2;
          if (comparator) {
            mapped.pop();
          }
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined2, comparator) : [];
        });

        function join(array2, separator) {
          return array2 == null ? "" : nativeJoin.call(array2, separator);
        }

        function last(array2) {
          var length = array2 == null ? 0 : array2.length;
          return length ? array2[length - 1] : undefined2;
        }

        function lastIndexOf(array2, value, fromIndex) {
          var length = array2 == null ? 0 : array2.length;
          if (!length) {
            return -1;
          }
          var index7 = length;
          if (fromIndex !== undefined2) {
            index7 = toInteger(fromIndex);
            index7 = index7 < 0 ? nativeMax(length + index7, 0) : nativeMin(index7, length - 1);
          }
          return value === value ? strictLastIndexOf(array2, value, index7) : baseFindIndex(array2, baseIsNaN, index7, true);
        }

        function nth(array2, n) {
          return array2 && array2.length ? baseNth(array2, toInteger(n)) : undefined2;
        }

        var pull = baseRest(pullAll);

        function pullAll(array2, values2) {
          return array2 && array2.length && values2 && values2.length ? basePullAll(array2, values2) : array2;
        }

        function pullAllBy(array2, values2, iteratee2) {
          return array2 && array2.length && values2 && values2.length ? basePullAll(array2, values2, getIteratee(iteratee2, 2)) : array2;
        }

        function pullAllWith(array2, values2, comparator) {
          return array2 && array2.length && values2 && values2.length ? basePullAll(array2, values2, undefined2, comparator) : array2;
        }

        var pullAt = flatRest(function(array2, indexes) {
          var length = array2 == null ? 0 : array2.length, result2 = baseAt(array2, indexes);
          basePullAt(array2, arrayMap(indexes, function(index7) {
            return isIndex(index7, length) ? +index7 : index7;
          }).sort(compareAscending));
          return result2;
        });

        function remove(array2, predicate) {
          var result2 = [];
          if (!(array2 && array2.length)) {
            return result2;
          }
          var index7 = -1, indexes = [], length = array2.length;
          predicate = getIteratee(predicate, 3);
          while (++index7 < length) {
            var value = array2[index7];
            if (predicate(value, index7, array2)) {
              result2.push(value);
              indexes.push(index7);
            }
          }
          basePullAt(array2, indexes);
          return result2;
        }

        function reverse(array2) {
          return array2 == null ? array2 : nativeReverse.call(array2);
        }

        function slice(array2, start, end) {
          var length = array2 == null ? 0 : array2.length;
          if (!length) {
            return [];
          }
          if (end && typeof end != "number" && isIterateeCall(array2, start, end)) {
            start = 0;
            end = length;
          } else {
            start = start == null ? 0 : toInteger(start);
            end = end === undefined2 ? length : toInteger(end);
          }
          return baseSlice(array2, start, end);
        }

        function sortedIndex(array2, value) {
          return baseSortedIndex(array2, value);
        }

        function sortedIndexBy(array2, value, iteratee2) {
          return baseSortedIndexBy(array2, value, getIteratee(iteratee2, 2));
        }

        function sortedIndexOf(array2, value) {
          var length = array2 == null ? 0 : array2.length;
          if (length) {
            var index7 = baseSortedIndex(array2, value);
            if (index7 < length && eq(array2[index7], value)) {
              return index7;
            }
          }
          return -1;
        }

        function sortedLastIndex(array2, value) {
          return baseSortedIndex(array2, value, true);
        }

        function sortedLastIndexBy(array2, value, iteratee2) {
          return baseSortedIndexBy(array2, value, getIteratee(iteratee2, 2), true);
        }

        function sortedLastIndexOf(array2, value) {
          var length = array2 == null ? 0 : array2.length;
          if (length) {
            var index7 = baseSortedIndex(array2, value, true) - 1;
            if (eq(array2[index7], value)) {
              return index7;
            }
          }
          return -1;
        }

        function sortedUniq(array2) {
          return array2 && array2.length ? baseSortedUniq(array2) : [];
        }

        function sortedUniqBy(array2, iteratee2) {
          return array2 && array2.length ? baseSortedUniq(array2, getIteratee(iteratee2, 2)) : [];
        }

        function tail(array2) {
          var length = array2 == null ? 0 : array2.length;
          return length ? baseSlice(array2, 1, length) : [];
        }

        function take(array2, n, guard) {
          if (!(array2 && array2.length)) {
            return [];
          }
          n = guard || n === undefined2 ? 1 : toInteger(n);
          return baseSlice(array2, 0, n < 0 ? 0 : n);
        }

        function takeRight(array2, n, guard) {
          var length = array2 == null ? 0 : array2.length;
          if (!length) {
            return [];
          }
          n = guard || n === undefined2 ? 1 : toInteger(n);
          n = length - n;
          return baseSlice(array2, n < 0 ? 0 : n, length);
        }

        function takeRightWhile(array2, predicate) {
          return array2 && array2.length ? baseWhile(array2, getIteratee(predicate, 3), false, true) : [];
        }

        function takeWhile(array2, predicate) {
          return array2 && array2.length ? baseWhile(array2, getIteratee(predicate, 3)) : [];
        }

        var union = baseRest(function(arrays) {
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
        });
        var unionBy = baseRest(function(arrays) {
          var iteratee2 = last(arrays);
          if (isArrayLikeObject(iteratee2)) {
            iteratee2 = undefined2;
          }
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2));
        });
        var unionWith = baseRest(function(arrays) {
          var comparator = last(arrays);
          comparator = typeof comparator == "function" ? comparator : undefined2;
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined2, comparator);
        });

        function uniq(array2) {
          return array2 && array2.length ? baseUniq(array2) : [];
        }

        function uniqBy(array2, iteratee2) {
          return array2 && array2.length ? baseUniq(array2, getIteratee(iteratee2, 2)) : [];
        }

        function uniqWith(array2, comparator) {
          comparator = typeof comparator == "function" ? comparator : undefined2;
          return array2 && array2.length ? baseUniq(array2, undefined2, comparator) : [];
        }

        function unzip(array2) {
          if (!(array2 && array2.length)) {
            return [];
          }
          var length = 0;
          array2 = arrayFilter(array2, function(group) {
            if (isArrayLikeObject(group)) {
              length = nativeMax(group.length, length);
              return true;
            }
          });
          return baseTimes(length, function(index7) {
            return arrayMap(array2, baseProperty(index7));
          });
        }

        function unzipWith(array2, iteratee2) {
          if (!(array2 && array2.length)) {
            return [];
          }
          var result2 = unzip(array2);
          if (iteratee2 == null) {
            return result2;
          }
          return arrayMap(result2, function(group) {
            return apply(iteratee2, undefined2, group);
          });
        }

        var without = baseRest(function(array2, values2) {
          return isArrayLikeObject(array2) ? baseDifference(array2, values2) : [];
        });
        var xor = baseRest(function(arrays) {
          return baseXor(arrayFilter(arrays, isArrayLikeObject));
        });
        var xorBy = baseRest(function(arrays) {
          var iteratee2 = last(arrays);
          if (isArrayLikeObject(iteratee2)) {
            iteratee2 = undefined2;
          }
          return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee2, 2));
        });
        var xorWith = baseRest(function(arrays) {
          var comparator = last(arrays);
          comparator = typeof comparator == "function" ? comparator : undefined2;
          return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined2, comparator);
        });
        var zip = baseRest(unzip);

        function zipObject(props, values2) {
          return baseZipObject(props || [], values2 || [], assignValue);
        }

        function zipObjectDeep(props, values2) {
          return baseZipObject(props || [], values2 || [], baseSet);
        }

        var zipWith = baseRest(function(arrays) {
          var length = arrays.length, iteratee2 = length > 1 ? arrays[length - 1] : undefined2;
          iteratee2 = typeof iteratee2 == "function" ? (arrays.pop(), iteratee2) : undefined2;
          return unzipWith(arrays, iteratee2);
        });

        function chain(value) {
          var result2 = lodash(value);
          result2.__chain__ = true;
          return result2;
        }

        function tap(value, interceptor) {
          interceptor(value);
          return value;
        }

        function thru(value, interceptor) {
          return interceptor(value);
        }

        var wrapperAt = flatRest(function(paths) {
          var length = paths.length, start = length ? paths[0] : 0, value = this.__wrapped__,
            interceptor = function(object) {
              return baseAt(object, paths);
            };
          if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
            return this.thru(interceptor);
          }
          value = value.slice(start, +start + (length ? 1 : 0));
          value.__actions__.push({
            "func": thru,
            "args": [interceptor],
            "thisArg": undefined2
          });
          return new LodashWrapper(value, this.__chain__).thru(function(array2) {
            if (length && !array2.length) {
              array2.push(undefined2);
            }
            return array2;
          });
        });

        function wrapperChain() {
          return chain(this);
        }

        function wrapperCommit() {
          return new LodashWrapper(this.value(), this.__chain__);
        }

        function wrapperNext() {
          if (this.__values__ === undefined2) {
            this.__values__ = toArray(this.value());
          }
          var done = this.__index__ >= this.__values__.length,
            value = done ? undefined2 : this.__values__[this.__index__++];
          return { "done": done, "value": value };
        }

        function wrapperToIterator() {
          return this;
        }

        function wrapperPlant(value) {
          var result2, parent2 = this;
          while (parent2 instanceof baseLodash) {
            var clone3 = wrapperClone(parent2);
            clone3.__index__ = 0;
            clone3.__values__ = undefined2;
            if (result2) {
              previous.__wrapped__ = clone3;
            } else {
              result2 = clone3;
            }
            var previous = clone3;
            parent2 = parent2.__wrapped__;
          }
          previous.__wrapped__ = value;
          return result2;
        }

        function wrapperReverse() {
          var value = this.__wrapped__;
          if (value instanceof LazyWrapper) {
            var wrapped = value;
            if (this.__actions__.length) {
              wrapped = new LazyWrapper(this);
            }
            wrapped = wrapped.reverse();
            wrapped.__actions__.push({
              "func": thru,
              "args": [reverse],
              "thisArg": undefined2
            });
            return new LodashWrapper(wrapped, this.__chain__);
          }
          return this.thru(reverse);
        }

        function wrapperValue() {
          return baseWrapperValue(this.__wrapped__, this.__actions__);
        }

        var countBy = createAggregator(function(result2, value, key2) {
          if (hasOwnProperty.call(result2, key2)) {
            ++result2[key2];
          } else {
            baseAssignValue(result2, key2, 1);
          }
        });

        function every(collection, predicate, guard) {
          var func = isArray(collection) ? arrayEvery : baseEvery;
          if (guard && isIterateeCall(collection, predicate, guard)) {
            predicate = undefined2;
          }
          return func(collection, getIteratee(predicate, 3));
        }

        function filter(collection, predicate) {
          var func = isArray(collection) ? arrayFilter : baseFilter;
          return func(collection, getIteratee(predicate, 3));
        }

        var find = createFind(findIndex);
        var findLast = createFind(findLastIndex);

        function flatMap(collection, iteratee2) {
          return baseFlatten(map(collection, iteratee2), 1);
        }

        function flatMapDeep(collection, iteratee2) {
          return baseFlatten(map(collection, iteratee2), INFINITY);
        }

        function flatMapDepth(collection, iteratee2, depth) {
          depth = depth === undefined2 ? 1 : toInteger(depth);
          return baseFlatten(map(collection, iteratee2), depth);
        }

        function forEach(collection, iteratee2) {
          var func = isArray(collection) ? arrayEach : baseEach;
          return func(collection, getIteratee(iteratee2, 3));
        }

        function forEachRight(collection, iteratee2) {
          var func = isArray(collection) ? arrayEachRight : baseEachRight;
          return func(collection, getIteratee(iteratee2, 3));
        }

        var groupBy = createAggregator(function(result2, value, key2) {
          if (hasOwnProperty.call(result2, key2)) {
            result2[key2].push(value);
          } else {
            baseAssignValue(result2, key2, [value]);
          }
        });

        function includes(collection, value, fromIndex, guard) {
          collection = isArrayLike(collection) ? collection : values(collection);
          fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
          var length = collection.length;
          if (fromIndex < 0) {
            fromIndex = nativeMax(length + fromIndex, 0);
          }
          return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
        }

        var invokeMap = baseRest(function(collection, path, args) {
          var index7 = -1, isFunc = typeof path == "function",
            result2 = isArrayLike(collection) ? Array2(collection.length) : [];
          baseEach(collection, function(value) {
            result2[++index7] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
          });
          return result2;
        });
        var keyBy = createAggregator(function(result2, value, key2) {
          baseAssignValue(result2, key2, value);
        });

        function map(collection, iteratee2) {
          var func = isArray(collection) ? arrayMap : baseMap;
          return func(collection, getIteratee(iteratee2, 3));
        }

        function orderBy(collection, iteratees, orders, guard) {
          if (collection == null) {
            return [];
          }
          if (!isArray(iteratees)) {
            iteratees = iteratees == null ? [] : [iteratees];
          }
          orders = guard ? undefined2 : orders;
          if (!isArray(orders)) {
            orders = orders == null ? [] : [orders];
          }
          return baseOrderBy(collection, iteratees, orders);
        }

        var partition = createAggregator(function(result2, value, key2) {
          result2[key2 ? 0 : 1].push(value);
        }, function() {
          return [[], []];
        });

        function reduce(collection, iteratee2, accumulator) {
          var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
          return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEach);
        }

        function reduceRight(collection, iteratee2, accumulator) {
          var func = isArray(collection) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
          return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEachRight);
        }

        function reject(collection, predicate) {
          var func = isArray(collection) ? arrayFilter : baseFilter;
          return func(collection, negate(getIteratee(predicate, 3)));
        }

        function sample(collection) {
          var func = isArray(collection) ? arraySample : baseSample;
          return func(collection);
        }

        function sampleSize(collection, n, guard) {
          if (guard ? isIterateeCall(collection, n, guard) : n === undefined2) {
            n = 1;
          } else {
            n = toInteger(n);
          }
          var func = isArray(collection) ? arraySampleSize : baseSampleSize;
          return func(collection, n);
        }

        function shuffle(collection) {
          var func = isArray(collection) ? arrayShuffle : baseShuffle;
          return func(collection);
        }

        function size(collection) {
          if (collection == null) {
            return 0;
          }
          if (isArrayLike(collection)) {
            return isString(collection) ? stringSize(collection) : collection.length;
          }
          var tag = getTag(collection);
          if (tag == mapTag || tag == setTag) {
            return collection.size;
          }
          return baseKeys(collection).length;
        }

        function some(collection, predicate, guard) {
          var func = isArray(collection) ? arraySome : baseSome;
          if (guard && isIterateeCall(collection, predicate, guard)) {
            predicate = undefined2;
          }
          return func(collection, getIteratee(predicate, 3));
        }

        var sortBy = baseRest(function(collection, iteratees) {
          if (collection == null) {
            return [];
          }
          var length = iteratees.length;
          if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
            iteratees = [];
          } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
            iteratees = [iteratees[0]];
          }
          return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
        });
        var now = ctxNow || function() {
          return root.Date.now();
        };

        function after(n, func) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          n = toInteger(n);
          return function() {
            if (--n < 1) {
              return func.apply(this, arguments);
            }
          };
        }

        function ary(func, n, guard) {
          n = guard ? undefined2 : n;
          n = func && n == null ? func.length : n;
          return createWrap(func, WRAP_ARY_FLAG, undefined2, undefined2, undefined2, undefined2, n);
        }

        function before(n, func) {
          var result2;
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          n = toInteger(n);
          return function() {
            if (--n > 0) {
              result2 = func.apply(this, arguments);
            }
            if (n <= 1) {
              func = undefined2;
            }
            return result2;
          };
        }

        var bind = baseRest(function(func, thisArg, partials) {
          var bitmask = WRAP_BIND_FLAG;
          if (partials.length) {
            var holders = replaceHolders(partials, getHolder(bind));
            bitmask |= WRAP_PARTIAL_FLAG;
          }
          return createWrap(func, bitmask, thisArg, partials, holders);
        });
        var bindKey = baseRest(function(object, key2, partials) {
          var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
          if (partials.length) {
            var holders = replaceHolders(partials, getHolder(bindKey));
            bitmask |= WRAP_PARTIAL_FLAG;
          }
          return createWrap(key2, bitmask, object, partials, holders);
        });

        function curry(func, arity, guard) {
          arity = guard ? undefined2 : arity;
          var result2 = createWrap(func, WRAP_CURRY_FLAG, undefined2, undefined2, undefined2, undefined2, undefined2, arity);
          result2.placeholder = curry.placeholder;
          return result2;
        }

        function curryRight(func, arity, guard) {
          arity = guard ? undefined2 : arity;
          var result2 = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined2, undefined2, undefined2, undefined2, undefined2, arity);
          result2.placeholder = curryRight.placeholder;
          return result2;
        }

        function debounce(func, wait, options) {
          var lastArgs, lastThis, maxWait, result2, timerId, lastCallTime, lastInvokeTime = 0, leading = false,
            maxing = false, trailing = true;
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          wait = toNumber(wait) || 0;
          if (isObject(options)) {
            leading = !!options.leading;
            maxing = "maxWait" in options;
            maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
            trailing = "trailing" in options ? !!options.trailing : trailing;
          }

          function invokeFunc(time) {
            var args = lastArgs, thisArg = lastThis;
            lastArgs = lastThis = undefined2;
            lastInvokeTime = time;
            result2 = func.apply(thisArg, args);
            return result2;
          }

          function leadingEdge(time) {
            lastInvokeTime = time;
            timerId = setTimeout(timerExpired, wait);
            return leading ? invokeFunc(time) : result2;
          }

          function remainingWait(time) {
            var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime,
              timeWaiting = wait - timeSinceLastCall;
            return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
          }

          function shouldInvoke(time) {
            var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
            return lastCallTime === undefined2 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
          }

          function timerExpired() {
            var time = now();
            if (shouldInvoke(time)) {
              return trailingEdge(time);
            }
            timerId = setTimeout(timerExpired, remainingWait(time));
          }

          function trailingEdge(time) {
            timerId = undefined2;
            if (trailing && lastArgs) {
              return invokeFunc(time);
            }
            lastArgs = lastThis = undefined2;
            return result2;
          }

          function cancel() {
            if (timerId !== undefined2) {
              clearTimeout(timerId);
            }
            lastInvokeTime = 0;
            lastArgs = lastCallTime = lastThis = timerId = undefined2;
          }

          function flush() {
            return timerId === undefined2 ? result2 : trailingEdge(now());
          }

          function debounced() {
            var time = now(), isInvoking = shouldInvoke(time);
            lastArgs = arguments;
            lastThis = this;
            lastCallTime = time;
            if (isInvoking) {
              if (timerId === undefined2) {
                return leadingEdge(lastCallTime);
              }
              if (maxing) {
                clearTimeout(timerId);
                timerId = setTimeout(timerExpired, wait);
                return invokeFunc(lastCallTime);
              }
            }
            if (timerId === undefined2) {
              timerId = setTimeout(timerExpired, wait);
            }
            return result2;
          }

          debounced.cancel = cancel;
          debounced.flush = flush;
          return debounced;
        }

        var defer = baseRest(function(func, args) {
          return baseDelay(func, 1, args);
        });
        var delay = baseRest(function(func, wait, args) {
          return baseDelay(func, toNumber(wait) || 0, args);
        });

        function flip(func) {
          return createWrap(func, WRAP_FLIP_FLAG);
        }

        function memoize(func, resolver) {
          if (typeof func != "function" || resolver != null && typeof resolver != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          var memoized = function() {
            var args = arguments, key2 = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
            if (cache.has(key2)) {
              return cache.get(key2);
            }
            var result2 = func.apply(this, args);
            memoized.cache = cache.set(key2, result2) || cache;
            return result2;
          };
          memoized.cache = new (memoize.Cache || MapCache)();
          return memoized;
        }

        memoize.Cache = MapCache;

        function negate(predicate) {
          if (typeof predicate != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          return function() {
            var args = arguments;
            switch (args.length) {
              case 0:
                return !predicate.call(this);
              case 1:
                return !predicate.call(this, args[0]);
              case 2:
                return !predicate.call(this, args[0], args[1]);
              case 3:
                return !predicate.call(this, args[0], args[1], args[2]);
            }
            return !predicate.apply(this, args);
          };
        }

        function once(func) {
          return before(2, func);
        }

        var overArgs = castRest(function(func, transforms) {
          transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
          var funcsLength = transforms.length;
          return baseRest(function(args) {
            var index7 = -1, length = nativeMin(args.length, funcsLength);
            while (++index7 < length) {
              args[index7] = transforms[index7].call(this, args[index7]);
            }
            return apply(func, this, args);
          });
        });
        var partial = baseRest(function(func, partials) {
          var holders = replaceHolders(partials, getHolder(partial));
          return createWrap(func, WRAP_PARTIAL_FLAG, undefined2, partials, holders);
        });
        var partialRight = baseRest(function(func, partials) {
          var holders = replaceHolders(partials, getHolder(partialRight));
          return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined2, partials, holders);
        });
        var rearg = flatRest(function(func, indexes) {
          return createWrap(func, WRAP_REARG_FLAG, undefined2, undefined2, undefined2, indexes);
        });

        function rest(func, start) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          start = start === undefined2 ? start : toInteger(start);
          return baseRest(func, start);
        }

        function spread(func, start) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          start = start == null ? 0 : nativeMax(toInteger(start), 0);
          return baseRest(function(args) {
            var array2 = args[start], otherArgs = castSlice(args, 0, start);
            if (array2) {
              arrayPush(otherArgs, array2);
            }
            return apply(func, this, otherArgs);
          });
        }

        function throttle(func, wait, options) {
          var leading = true, trailing = true;
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          if (isObject(options)) {
            leading = "leading" in options ? !!options.leading : leading;
            trailing = "trailing" in options ? !!options.trailing : trailing;
          }
          return debounce(func, wait, {
            "leading": leading,
            "maxWait": wait,
            "trailing": trailing
          });
        }

        function unary(func) {
          return ary(func, 1);
        }

        function wrap(value, wrapper) {
          return partial(castFunction(wrapper), value);
        }

        function castArray() {
          if (!arguments.length) {
            return [];
          }
          var value = arguments[0];
          return isArray(value) ? value : [value];
        }

        function clone2(value) {
          return baseClone(value, CLONE_SYMBOLS_FLAG);
        }

        function cloneWith(value, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
        }

        function cloneDeep(value) {
          return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
        }

        function cloneDeepWith(value, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
        }

        function conformsTo(object, source) {
          return source == null || baseConformsTo(object, source, keys(source));
        }

        function eq(value, other) {
          return value === other || value !== value && other !== other;
        }

        var gt = createRelationalOperation(baseGt);
        var gte = createRelationalOperation(function(value, other) {
          return value >= other;
        });
        var isArguments = baseIsArguments(function() {
          return arguments;
        }()) ? baseIsArguments : function(value) {
          return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
        };
        var isArray = Array2.isArray;
        var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

        function isArrayLike(value) {
          return value != null && isLength(value.length) && !isFunction(value);
        }

        function isArrayLikeObject(value) {
          return isObjectLike(value) && isArrayLike(value);
        }

        function isBoolean(value) {
          return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
        }

        var isBuffer = nativeIsBuffer || stubFalse;
        var isDate2 = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

        function isElement(value) {
          return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
        }

        function isEmpty(value) {
          if (value == null) {
            return true;
          }
          if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
            return !value.length;
          }
          var tag = getTag(value);
          if (tag == mapTag || tag == setTag) {
            return !value.size;
          }
          if (isPrototype(value)) {
            return !baseKeys(value).length;
          }
          for (var key2 in value) {
            if (hasOwnProperty.call(value, key2)) {
              return false;
            }
          }
          return true;
        }

        function isEqual(value, other) {
          return baseIsEqual(value, other);
        }

        function isEqualWith(value, other, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          var result2 = customizer ? customizer(value, other) : undefined2;
          return result2 === undefined2 ? baseIsEqual(value, other, undefined2, customizer) : !!result2;
        }

        function isError(value) {
          if (!isObjectLike(value)) {
            return false;
          }
          var tag = baseGetTag(value);
          return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
        }

        function isFinite2(value) {
          return typeof value == "number" && nativeIsFinite(value);
        }

        function isFunction(value) {
          if (!isObject(value)) {
            return false;
          }
          var tag = baseGetTag(value);
          return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
        }

        function isInteger(value) {
          return typeof value == "number" && value == toInteger(value);
        }

        function isLength(value) {
          return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
        }

        function isObject(value) {
          var type = typeof value;
          return value != null && (type == "object" || type == "function");
        }

        function isObjectLike(value) {
          return value != null && typeof value == "object";
        }

        var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

        function isMatch(object, source) {
          return object === source || baseIsMatch(object, source, getMatchData(source));
        }

        function isMatchWith(object, source, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return baseIsMatch(object, source, getMatchData(source), customizer);
        }

        function isNaN2(value) {
          return isNumber(value) && value != +value;
        }

        function isNative(value) {
          if (isMaskable(value)) {
            throw new Error3(CORE_ERROR_TEXT);
          }
          return baseIsNative(value);
        }

        function isNull(value) {
          return value === null;
        }

        function isNil(value) {
          return value == null;
        }

        function isNumber(value) {
          return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
        }

        function isPlainObject(value) {
          if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
            return false;
          }
          var proto = getPrototype(value);
          if (proto === null) {
            return true;
          }
          var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
          return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
        }

        var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

        function isSafeInteger(value) {
          return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
        }

        var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

        function isString(value) {
          return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
        }

        function isSymbol(value) {
          return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
        }

        var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

        function isUndefined(value) {
          return value === undefined2;
        }

        function isWeakMap(value) {
          return isObjectLike(value) && getTag(value) == weakMapTag;
        }

        function isWeakSet(value) {
          return isObjectLike(value) && baseGetTag(value) == weakSetTag;
        }

        var lt = createRelationalOperation(baseLt);
        var lte = createRelationalOperation(function(value, other) {
          return value <= other;
        });

        function toArray(value) {
          if (!value) {
            return [];
          }
          if (isArrayLike(value)) {
            return isString(value) ? stringToArray(value) : copyArray(value);
          }
          if (symIterator && value[symIterator]) {
            return iteratorToArray(value[symIterator]());
          }
          var tag = getTag(value), func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
          return func(value);
        }

        function toFinite(value) {
          if (!value) {
            return value === 0 ? value : 0;
          }
          value = toNumber(value);
          if (value === INFINITY || value === -INFINITY) {
            var sign = value < 0 ? -1 : 1;
            return sign * MAX_INTEGER;
          }
          return value === value ? value : 0;
        }

        function toInteger(value) {
          var result2 = toFinite(value), remainder = result2 % 1;
          return result2 === result2 ? remainder ? result2 - remainder : result2 : 0;
        }

        function toLength(value) {
          return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
        }

        function toNumber(value) {
          if (typeof value == "number") {
            return value;
          }
          if (isSymbol(value)) {
            return NAN;
          }
          if (isObject(value)) {
            var other = typeof value.valueOf == "function" ? value.valueOf() : value;
            value = isObject(other) ? other + "" : other;
          }
          if (typeof value != "string") {
            return value === 0 ? value : +value;
          }
          value = baseTrim(value);
          var isBinary = reIsBinary.test(value);
          return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
        }

        function toPlainObject(value) {
          return copyObject(value, keysIn(value));
        }

        function toSafeInteger(value) {
          return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
        }

        function toString(value) {
          return value == null ? "" : baseToString(value);
        }

        var assign = createAssigner(function(object, source) {
          if (isPrototype(source) || isArrayLike(source)) {
            copyObject(source, keys(source), object);
            return;
          }
          for (var key2 in source) {
            if (hasOwnProperty.call(source, key2)) {
              assignValue(object, key2, source[key2]);
            }
          }
        });
        var assignIn = createAssigner(function(object, source) {
          copyObject(source, keysIn(source), object);
        });
        var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
          copyObject(source, keysIn(source), object, customizer);
        });
        var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
          copyObject(source, keys(source), object, customizer);
        });
        var at = flatRest(baseAt);

        function create(prototype, properties) {
          var result2 = baseCreate(prototype);
          return properties == null ? result2 : baseAssign(result2, properties);
        }

        var defaults = baseRest(function(object, sources) {
          object = Object2(object);
          var index7 = -1;
          var length = sources.length;
          var guard = length > 2 ? sources[2] : undefined2;
          if (guard && isIterateeCall(sources[0], sources[1], guard)) {
            length = 1;
          }
          while (++index7 < length) {
            var source = sources[index7];
            var props = keysIn(source);
            var propsIndex = -1;
            var propsLength = props.length;
            while (++propsIndex < propsLength) {
              var key2 = props[propsIndex];
              var value = object[key2];
              if (value === undefined2 || eq(value, objectProto[key2]) && !hasOwnProperty.call(object, key2)) {
                object[key2] = source[key2];
              }
            }
          }
          return object;
        });
        var defaultsDeep = baseRest(function(args) {
          args.push(undefined2, customDefaultsMerge);
          return apply(mergeWith, undefined2, args);
        });

        function findKey(object, predicate) {
          return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
        }

        function findLastKey(object, predicate) {
          return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
        }

        function forIn(object, iteratee2) {
          return object == null ? object : baseFor(object, getIteratee(iteratee2, 3), keysIn);
        }

        function forInRight(object, iteratee2) {
          return object == null ? object : baseForRight(object, getIteratee(iteratee2, 3), keysIn);
        }

        function forOwn(object, iteratee2) {
          return object && baseForOwn(object, getIteratee(iteratee2, 3));
        }

        function forOwnRight(object, iteratee2) {
          return object && baseForOwnRight(object, getIteratee(iteratee2, 3));
        }

        function functions(object) {
          return object == null ? [] : baseFunctions(object, keys(object));
        }

        function functionsIn(object) {
          return object == null ? [] : baseFunctions(object, keysIn(object));
        }

        function get(object, path, defaultValue) {
          var result2 = object == null ? undefined2 : baseGet(object, path);
          return result2 === undefined2 ? defaultValue : result2;
        }

        function has(object, path) {
          return object != null && hasPath(object, path, baseHas);
        }

        function hasIn(object, path) {
          return object != null && hasPath(object, path, baseHasIn);
        }

        var invert = createInverter(function(result2, value, key2) {
          if (value != null && typeof value.toString != "function") {
            value = nativeObjectToString.call(value);
          }
          result2[value] = key2;
        }, constant(identity));
        var invertBy = createInverter(function(result2, value, key2) {
          if (value != null && typeof value.toString != "function") {
            value = nativeObjectToString.call(value);
          }
          if (hasOwnProperty.call(result2, value)) {
            result2[value].push(key2);
          } else {
            result2[value] = [key2];
          }
        }, getIteratee);
        var invoke = baseRest(baseInvoke);

        function keys(object) {
          return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
        }

        function keysIn(object) {
          return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
        }

        function mapKeys(object, iteratee2) {
          var result2 = {};
          iteratee2 = getIteratee(iteratee2, 3);
          baseForOwn(object, function(value, key2, object2) {
            baseAssignValue(result2, iteratee2(value, key2, object2), value);
          });
          return result2;
        }

        function mapValues(object, iteratee2) {
          var result2 = {};
          iteratee2 = getIteratee(iteratee2, 3);
          baseForOwn(object, function(value, key2, object2) {
            baseAssignValue(result2, key2, iteratee2(value, key2, object2));
          });
          return result2;
        }

        var merge = createAssigner(function(object, source, srcIndex) {
          baseMerge(object, source, srcIndex);
        });
        var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
          baseMerge(object, source, srcIndex, customizer);
        });
        var omit = flatRest(function(object, paths) {
          var result2 = {};
          if (object == null) {
            return result2;
          }
          var isDeep = false;
          paths = arrayMap(paths, function(path) {
            path = castPath(path, object);
            isDeep || (isDeep = path.length > 1);
            return path;
          });
          copyObject(object, getAllKeysIn(object), result2);
          if (isDeep) {
            result2 = baseClone(result2, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
          }
          var length = paths.length;
          while (length--) {
            baseUnset(result2, paths[length]);
          }
          return result2;
        });

        function omitBy(object, predicate) {
          return pickBy(object, negate(getIteratee(predicate)));
        }

        var pick = flatRest(function(object, paths) {
          return object == null ? {} : basePick(object, paths);
        });

        function pickBy(object, predicate) {
          if (object == null) {
            return {};
          }
          var props = arrayMap(getAllKeysIn(object), function(prop) {
            return [prop];
          });
          predicate = getIteratee(predicate);
          return basePickBy(object, props, function(value, path) {
            return predicate(value, path[0]);
          });
        }

        function result(object, path, defaultValue) {
          path = castPath(path, object);
          var index7 = -1, length = path.length;
          if (!length) {
            length = 1;
            object = undefined2;
          }
          while (++index7 < length) {
            var value = object == null ? undefined2 : object[toKey(path[index7])];
            if (value === undefined2) {
              index7 = length;
              value = defaultValue;
            }
            object = isFunction(value) ? value.call(object) : value;
          }
          return object;
        }

        function set(object, path, value) {
          return object == null ? object : baseSet(object, path, value);
        }

        function setWith(object, path, value, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return object == null ? object : baseSet(object, path, value, customizer);
        }

        var toPairs = createToPairs(keys);
        var toPairsIn = createToPairs(keysIn);

        function transform(object, iteratee2, accumulator) {
          var isArr = isArray(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
          iteratee2 = getIteratee(iteratee2, 4);
          if (accumulator == null) {
            var Ctor = object && object.constructor;
            if (isArrLike) {
              accumulator = isArr ? new Ctor() : [];
            } else if (isObject(object)) {
              accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
            } else {
              accumulator = {};
            }
          }
          (isArrLike ? arrayEach : baseForOwn)(object, function(value, index7, object2) {
            return iteratee2(accumulator, value, index7, object2);
          });
          return accumulator;
        }

        function unset(object, path) {
          return object == null ? true : baseUnset(object, path);
        }

        function update(object, path, updater) {
          return object == null ? object : baseUpdate(object, path, castFunction(updater));
        }

        function updateWith(object, path, updater, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
        }

        function values(object) {
          return object == null ? [] : baseValues(object, keys(object));
        }

        function valuesIn(object) {
          return object == null ? [] : baseValues(object, keysIn(object));
        }

        function clamp(number, lower2, upper) {
          if (upper === undefined2) {
            upper = lower2;
            lower2 = undefined2;
          }
          if (upper !== undefined2) {
            upper = toNumber(upper);
            upper = upper === upper ? upper : 0;
          }
          if (lower2 !== undefined2) {
            lower2 = toNumber(lower2);
            lower2 = lower2 === lower2 ? lower2 : 0;
          }
          return baseClamp(toNumber(number), lower2, upper);
        }

        function inRange(number, start, end) {
          start = toFinite(start);
          if (end === undefined2) {
            end = start;
            start = 0;
          } else {
            end = toFinite(end);
          }
          number = toNumber(number);
          return baseInRange(number, start, end);
        }

        function random(lower2, upper, floating) {
          if (floating && typeof floating != "boolean" && isIterateeCall(lower2, upper, floating)) {
            upper = floating = undefined2;
          }
          if (floating === undefined2) {
            if (typeof upper == "boolean") {
              floating = upper;
              upper = undefined2;
            } else if (typeof lower2 == "boolean") {
              floating = lower2;
              lower2 = undefined2;
            }
          }
          if (lower2 === undefined2 && upper === undefined2) {
            lower2 = 0;
            upper = 1;
          } else {
            lower2 = toFinite(lower2);
            if (upper === undefined2) {
              upper = lower2;
              lower2 = 0;
            } else {
              upper = toFinite(upper);
            }
          }
          if (lower2 > upper) {
            var temp = lower2;
            lower2 = upper;
            upper = temp;
          }
          if (floating || lower2 % 1 || upper % 1) {
            var rand = nativeRandom();
            return nativeMin(lower2 + rand * (upper - lower2 + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
          }
          return baseRandom(lower2, upper);
        }

        var camelCase = createCompounder(function(result2, word, index7) {
          word = word.toLowerCase();
          return result2 + (index7 ? capitalize(word) : word);
        });

        function capitalize(string) {
          return upperFirst(toString(string).toLowerCase());
        }

        function deburr(string) {
          string = toString(string);
          return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
        }

        function endsWith(string, target, position) {
          string = toString(string);
          target = baseToString(target);
          var length = string.length;
          position = position === undefined2 ? length : baseClamp(toInteger(position), 0, length);
          var end = position;
          position -= target.length;
          return position >= 0 && string.slice(position, end) == target;
        }

        function escape2(string) {
          string = toString(string);
          return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
        }

        function escapeRegExp(string) {
          string = toString(string);
          return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
        }

        var kebabCase = createCompounder(function(result2, word, index7) {
          return result2 + (index7 ? "-" : "") + word.toLowerCase();
        });
        var lowerCase = createCompounder(function(result2, word, index7) {
          return result2 + (index7 ? " " : "") + word.toLowerCase();
        });
        var lowerFirst = createCaseFirst("toLowerCase");

        function pad(string, length, chars2) {
          string = toString(string);
          length = toInteger(length);
          var strLength = length ? stringSize(string) : 0;
          if (!length || strLength >= length) {
            return string;
          }
          var mid = (length - strLength) / 2;
          return createPadding(nativeFloor(mid), chars2) + string + createPadding(nativeCeil(mid), chars2);
        }

        function padEnd(string, length, chars2) {
          string = toString(string);
          length = toInteger(length);
          var strLength = length ? stringSize(string) : 0;
          return length && strLength < length ? string + createPadding(length - strLength, chars2) : string;
        }

        function padStart(string, length, chars2) {
          string = toString(string);
          length = toInteger(length);
          var strLength = length ? stringSize(string) : 0;
          return length && strLength < length ? createPadding(length - strLength, chars2) + string : string;
        }

        function parseInt2(string, radix, guard) {
          if (guard || radix == null) {
            radix = 0;
          } else if (radix) {
            radix = +radix;
          }
          return nativeParseInt(toString(string).replace(reTrimStart, ""), radix || 0);
        }

        function repeat(string, n, guard) {
          if (guard ? isIterateeCall(string, n, guard) : n === undefined2) {
            n = 1;
          } else {
            n = toInteger(n);
          }
          return baseRepeat(toString(string), n);
        }

        function replace() {
          var args = arguments, string = toString(args[0]);
          return args.length < 3 ? string : string.replace(args[1], args[2]);
        }

        var snakeCase = createCompounder(function(result2, word, index7) {
          return result2 + (index7 ? "_" : "") + word.toLowerCase();
        });

        function split(string, separator, limit) {
          if (limit && typeof limit != "number" && isIterateeCall(string, separator, limit)) {
            separator = limit = undefined2;
          }
          limit = limit === undefined2 ? MAX_ARRAY_LENGTH : limit >>> 0;
          if (!limit) {
            return [];
          }
          string = toString(string);
          if (string && (typeof separator == "string" || separator != null && !isRegExp(separator))) {
            separator = baseToString(separator);
            if (!separator && hasUnicode(string)) {
              return castSlice(stringToArray(string), 0, limit);
            }
          }
          return string.split(separator, limit);
        }

        var startCase = createCompounder(function(result2, word, index7) {
          return result2 + (index7 ? " " : "") + upperFirst(word);
        });

        function startsWith(string, target, position) {
          string = toString(string);
          position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
          target = baseToString(target);
          return string.slice(position, position + target.length) == target;
        }

        function template2(string, options, guard) {
          var settings2 = lodash.templateSettings;
          if (guard && isIterateeCall(string, options, guard)) {
            options = undefined2;
          }
          string = toString(string);
          options = assignInWith({}, options, settings2, customDefaultsAssignIn);
          var imports = assignInWith({}, options.imports, settings2.imports, customDefaultsAssignIn),
            importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
          var isEscaping, isEvaluating, index7 = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
          var reDelimiters = RegExp2((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
          var sourceURL = "//# sourceURL=" + (hasOwnProperty.call(options, "sourceURL") ? (options.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
          string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
            interpolateValue || (interpolateValue = esTemplateValue);
            source += string.slice(index7, offset).replace(reUnescapedString, escapeStringChar);
            if (escapeValue) {
              isEscaping = true;
              source += "' +\n__e(" + escapeValue + ") +\n'";
            }
            if (evaluateValue) {
              isEvaluating = true;
              source += "';\n" + evaluateValue + ";\n__p += '";
            }
            if (interpolateValue) {
              source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
            }
            index7 = offset + match.length;
            return match;
          });
          source += "';\n";
          var variable = hasOwnProperty.call(options, "variable") && options.variable;
          if (!variable) {
            source = "with (obj) {\n" + source + "\n}\n";
          } else if (reForbiddenIdentifierChars.test(variable)) {
            throw new Error3(INVALID_TEMPL_VAR_ERROR_TEXT);
          }
          source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
          source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
          var result2 = attempt(function() {
            return Function2(importsKeys, sourceURL + "return " + source).apply(undefined2, importsValues);
          });
          result2.source = source;
          if (isError(result2)) {
            throw result2;
          }
          return result2;
        }

        function toLower(value) {
          return toString(value).toLowerCase();
        }

        function toUpper(value) {
          return toString(value).toUpperCase();
        }

        function trim(string, chars2, guard) {
          string = toString(string);
          if (string && (guard || chars2 === undefined2)) {
            return baseTrim(string);
          }
          if (!string || !(chars2 = baseToString(chars2))) {
            return string;
          }
          var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars2),
            start = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
          return castSlice(strSymbols, start, end).join("");
        }

        function trimEnd(string, chars2, guard) {
          string = toString(string);
          if (string && (guard || chars2 === undefined2)) {
            return string.slice(0, trimmedEndIndex(string) + 1);
          }
          if (!string || !(chars2 = baseToString(chars2))) {
            return string;
          }
          var strSymbols = stringToArray(string), end = charsEndIndex(strSymbols, stringToArray(chars2)) + 1;
          return castSlice(strSymbols, 0, end).join("");
        }

        function trimStart(string, chars2, guard) {
          string = toString(string);
          if (string && (guard || chars2 === undefined2)) {
            return string.replace(reTrimStart, "");
          }
          if (!string || !(chars2 = baseToString(chars2))) {
            return string;
          }
          var strSymbols = stringToArray(string), start = charsStartIndex(strSymbols, stringToArray(chars2));
          return castSlice(strSymbols, start).join("");
        }

        function truncate(string, options) {
          var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
          if (isObject(options)) {
            var separator = "separator" in options ? options.separator : separator;
            length = "length" in options ? toInteger(options.length) : length;
            omission = "omission" in options ? baseToString(options.omission) : omission;
          }
          string = toString(string);
          var strLength = string.length;
          if (hasUnicode(string)) {
            var strSymbols = stringToArray(string);
            strLength = strSymbols.length;
          }
          if (length >= strLength) {
            return string;
          }
          var end = length - stringSize(omission);
          if (end < 1) {
            return omission;
          }
          var result2 = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
          if (separator === undefined2) {
            return result2 + omission;
          }
          if (strSymbols) {
            end += result2.length - end;
          }
          if (isRegExp(separator)) {
            if (string.slice(end).search(separator)) {
              var match, substring = result2;
              if (!separator.global) {
                separator = RegExp2(separator.source, toString(reFlags.exec(separator)) + "g");
              }
              separator.lastIndex = 0;
              while (match = separator.exec(substring)) {
                var newEnd = match.index;
              }
              result2 = result2.slice(0, newEnd === undefined2 ? end : newEnd);
            }
          } else if (string.indexOf(baseToString(separator), end) != end) {
            var index7 = result2.lastIndexOf(separator);
            if (index7 > -1) {
              result2 = result2.slice(0, index7);
            }
          }
          return result2 + omission;
        }

        function unescape2(string) {
          string = toString(string);
          return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
        }

        var upperCase = createCompounder(function(result2, word, index7) {
          return result2 + (index7 ? " " : "") + word.toUpperCase();
        });
        var upperFirst = createCaseFirst("toUpperCase");

        function words(string, pattern, guard) {
          string = toString(string);
          pattern = guard ? undefined2 : pattern;
          if (pattern === undefined2) {
            return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
          }
          return string.match(pattern) || [];
        }

        var attempt = baseRest(function(func, args) {
          try {
            return apply(func, undefined2, args);
          } catch (e2) {
            return isError(e2) ? e2 : new Error3(e2);
          }
        });
        var bindAll = flatRest(function(object, methodNames) {
          arrayEach(methodNames, function(key2) {
            key2 = toKey(key2);
            baseAssignValue(object, key2, bind(object[key2], object));
          });
          return object;
        });

        function cond(pairs) {
          var length = pairs == null ? 0 : pairs.length, toIteratee = getIteratee();
          pairs = !length ? [] : arrayMap(pairs, function(pair) {
            if (typeof pair[1] != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            return [toIteratee(pair[0]), pair[1]];
          });
          return baseRest(function(args) {
            var index7 = -1;
            while (++index7 < length) {
              var pair = pairs[index7];
              if (apply(pair[0], this, args)) {
                return apply(pair[1], this, args);
              }
            }
          });
        }

        function conforms(source) {
          return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
        }

        function constant(value) {
          return function() {
            return value;
          };
        }

        function defaultTo(value, defaultValue) {
          return value == null || value !== value ? defaultValue : value;
        }

        var flow = createFlow();
        var flowRight = createFlow(true);

        function identity(value) {
          return value;
        }

        function iteratee(func) {
          return baseIteratee(typeof func == "function" ? func : baseClone(func, CLONE_DEEP_FLAG));
        }

        function matches(source) {
          return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
        }

        function matchesProperty(path, srcValue) {
          return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
        }

        var method = baseRest(function(path, args) {
          return function(object) {
            return baseInvoke(object, path, args);
          };
        });
        var methodOf = baseRest(function(object, args) {
          return function(path) {
            return baseInvoke(object, path, args);
          };
        });

        function mixin(object, source, options) {
          var props = keys(source), methodNames = baseFunctions(source, props);
          if (options == null && !(isObject(source) && (methodNames.length || !props.length))) {
            options = source;
            source = object;
            object = this;
            methodNames = baseFunctions(source, keys(source));
          }
          var chain2 = !(isObject(options) && "chain" in options) || !!options.chain, isFunc = isFunction(object);
          arrayEach(methodNames, function(methodName) {
            var func = source[methodName];
            object[methodName] = func;
            if (isFunc) {
              object.prototype[methodName] = function() {
                var chainAll = this.__chain__;
                if (chain2 || chainAll) {
                  var result2 = object(this.__wrapped__), actions = result2.__actions__ = copyArray(this.__actions__);
                  actions.push({ "func": func, "args": arguments, "thisArg": object });
                  result2.__chain__ = chainAll;
                  return result2;
                }
                return func.apply(object, arrayPush([this.value()], arguments));
              };
            }
          });
          return object;
        }

        function noConflict() {
          if (root._ === this) {
            root._ = oldDash;
          }
          return this;
        }

        function noop4() {
        }

        function nthArg(n) {
          n = toInteger(n);
          return baseRest(function(args) {
            return baseNth(args, n);
          });
        }

        var over = createOver(arrayMap);
        var overEvery = createOver(arrayEvery);
        var overSome = createOver(arraySome);

        function property(path) {
          return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
        }

        function propertyOf(object) {
          return function(path) {
            return object == null ? undefined2 : baseGet(object, path);
          };
        }

        var range = createRange();
        var rangeRight = createRange(true);

        function stubArray() {
          return [];
        }

        function stubFalse() {
          return false;
        }

        function stubObject() {
          return {};
        }

        function stubString() {
          return "";
        }

        function stubTrue() {
          return true;
        }

        function times(n, iteratee2) {
          n = toInteger(n);
          if (n < 1 || n > MAX_SAFE_INTEGER) {
            return [];
          }
          var index7 = MAX_ARRAY_LENGTH, length = nativeMin(n, MAX_ARRAY_LENGTH);
          iteratee2 = getIteratee(iteratee2);
          n -= MAX_ARRAY_LENGTH;
          var result2 = baseTimes(length, iteratee2);
          while (++index7 < n) {
            iteratee2(index7);
          }
          return result2;
        }

        function toPath(value) {
          if (isArray(value)) {
            return arrayMap(value, toKey);
          }
          return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
        }

        function uniqueId(prefix) {
          var id = ++idCounter;
          return toString(prefix) + id;
        }

        var add = createMathOperation(function(augend, addend) {
          return augend + addend;
        }, 0);
        var ceil = createRound("ceil");
        var divide = createMathOperation(function(dividend, divisor) {
          return dividend / divisor;
        }, 1);
        var floor = createRound("floor");

        function max(array2) {
          return array2 && array2.length ? baseExtremum(array2, identity, baseGt) : undefined2;
        }

        function maxBy(array2, iteratee2) {
          return array2 && array2.length ? baseExtremum(array2, getIteratee(iteratee2, 2), baseGt) : undefined2;
        }

        function mean(array2) {
          return baseMean(array2, identity);
        }

        function meanBy(array2, iteratee2) {
          return baseMean(array2, getIteratee(iteratee2, 2));
        }

        function min(array2) {
          return array2 && array2.length ? baseExtremum(array2, identity, baseLt) : undefined2;
        }

        function minBy(array2, iteratee2) {
          return array2 && array2.length ? baseExtremum(array2, getIteratee(iteratee2, 2), baseLt) : undefined2;
        }

        var multiply = createMathOperation(function(multiplier, multiplicand) {
          return multiplier * multiplicand;
        }, 1);
        var round = createRound("round");
        var subtract = createMathOperation(function(minuend, subtrahend) {
          return minuend - subtrahend;
        }, 0);

        function sum(array2) {
          return array2 && array2.length ? baseSum(array2, identity) : 0;
        }

        function sumBy(array2, iteratee2) {
          return array2 && array2.length ? baseSum(array2, getIteratee(iteratee2, 2)) : 0;
        }

        lodash.after = after;
        lodash.ary = ary;
        lodash.assign = assign;
        lodash.assignIn = assignIn;
        lodash.assignInWith = assignInWith;
        lodash.assignWith = assignWith;
        lodash.at = at;
        lodash.before = before;
        lodash.bind = bind;
        lodash.bindAll = bindAll;
        lodash.bindKey = bindKey;
        lodash.castArray = castArray;
        lodash.chain = chain;
        lodash.chunk = chunk;
        lodash.compact = compact;
        lodash.concat = concat;
        lodash.cond = cond;
        lodash.conforms = conforms;
        lodash.constant = constant;
        lodash.countBy = countBy;
        lodash.create = create;
        lodash.curry = curry;
        lodash.curryRight = curryRight;
        lodash.debounce = debounce;
        lodash.defaults = defaults;
        lodash.defaultsDeep = defaultsDeep;
        lodash.defer = defer;
        lodash.delay = delay;
        lodash.difference = difference;
        lodash.differenceBy = differenceBy;
        lodash.differenceWith = differenceWith;
        lodash.drop = drop;
        lodash.dropRight = dropRight;
        lodash.dropRightWhile = dropRightWhile;
        lodash.dropWhile = dropWhile;
        lodash.fill = fill;
        lodash.filter = filter;
        lodash.flatMap = flatMap;
        lodash.flatMapDeep = flatMapDeep;
        lodash.flatMapDepth = flatMapDepth;
        lodash.flatten = flatten;
        lodash.flattenDeep = flattenDeep;
        lodash.flattenDepth = flattenDepth;
        lodash.flip = flip;
        lodash.flow = flow;
        lodash.flowRight = flowRight;
        lodash.fromPairs = fromPairs;
        lodash.functions = functions;
        lodash.functionsIn = functionsIn;
        lodash.groupBy = groupBy;
        lodash.initial = initial;
        lodash.intersection = intersection;
        lodash.intersectionBy = intersectionBy;
        lodash.intersectionWith = intersectionWith;
        lodash.invert = invert;
        lodash.invertBy = invertBy;
        lodash.invokeMap = invokeMap;
        lodash.iteratee = iteratee;
        lodash.keyBy = keyBy;
        lodash.keys = keys;
        lodash.keysIn = keysIn;
        lodash.map = map;
        lodash.mapKeys = mapKeys;
        lodash.mapValues = mapValues;
        lodash.matches = matches;
        lodash.matchesProperty = matchesProperty;
        lodash.memoize = memoize;
        lodash.merge = merge;
        lodash.mergeWith = mergeWith;
        lodash.method = method;
        lodash.methodOf = methodOf;
        lodash.mixin = mixin;
        lodash.negate = negate;
        lodash.nthArg = nthArg;
        lodash.omit = omit;
        lodash.omitBy = omitBy;
        lodash.once = once;
        lodash.orderBy = orderBy;
        lodash.over = over;
        lodash.overArgs = overArgs;
        lodash.overEvery = overEvery;
        lodash.overSome = overSome;
        lodash.partial = partial;
        lodash.partialRight = partialRight;
        lodash.partition = partition;
        lodash.pick = pick;
        lodash.pickBy = pickBy;
        lodash.property = property;
        lodash.propertyOf = propertyOf;
        lodash.pull = pull;
        lodash.pullAll = pullAll;
        lodash.pullAllBy = pullAllBy;
        lodash.pullAllWith = pullAllWith;
        lodash.pullAt = pullAt;
        lodash.range = range;
        lodash.rangeRight = rangeRight;
        lodash.rearg = rearg;
        lodash.reject = reject;
        lodash.remove = remove;
        lodash.rest = rest;
        lodash.reverse = reverse;
        lodash.sampleSize = sampleSize;
        lodash.set = set;
        lodash.setWith = setWith;
        lodash.shuffle = shuffle;
        lodash.slice = slice;
        lodash.sortBy = sortBy;
        lodash.sortedUniq = sortedUniq;
        lodash.sortedUniqBy = sortedUniqBy;
        lodash.split = split;
        lodash.spread = spread;
        lodash.tail = tail;
        lodash.take = take;
        lodash.takeRight = takeRight;
        lodash.takeRightWhile = takeRightWhile;
        lodash.takeWhile = takeWhile;
        lodash.tap = tap;
        lodash.throttle = throttle;
        lodash.thru = thru;
        lodash.toArray = toArray;
        lodash.toPairs = toPairs;
        lodash.toPairsIn = toPairsIn;
        lodash.toPath = toPath;
        lodash.toPlainObject = toPlainObject;
        lodash.transform = transform;
        lodash.unary = unary;
        lodash.union = union;
        lodash.unionBy = unionBy;
        lodash.unionWith = unionWith;
        lodash.uniq = uniq;
        lodash.uniqBy = uniqBy;
        lodash.uniqWith = uniqWith;
        lodash.unset = unset;
        lodash.unzip = unzip;
        lodash.unzipWith = unzipWith;
        lodash.update = update;
        lodash.updateWith = updateWith;
        lodash.values = values;
        lodash.valuesIn = valuesIn;
        lodash.without = without;
        lodash.words = words;
        lodash.wrap = wrap;
        lodash.xor = xor;
        lodash.xorBy = xorBy;
        lodash.xorWith = xorWith;
        lodash.zip = zip;
        lodash.zipObject = zipObject;
        lodash.zipObjectDeep = zipObjectDeep;
        lodash.zipWith = zipWith;
        lodash.entries = toPairs;
        lodash.entriesIn = toPairsIn;
        lodash.extend = assignIn;
        lodash.extendWith = assignInWith;
        mixin(lodash, lodash);
        lodash.add = add;
        lodash.attempt = attempt;
        lodash.camelCase = camelCase;
        lodash.capitalize = capitalize;
        lodash.ceil = ceil;
        lodash.clamp = clamp;
        lodash.clone = clone2;
        lodash.cloneDeep = cloneDeep;
        lodash.cloneDeepWith = cloneDeepWith;
        lodash.cloneWith = cloneWith;
        lodash.conformsTo = conformsTo;
        lodash.deburr = deburr;
        lodash.defaultTo = defaultTo;
        lodash.divide = divide;
        lodash.endsWith = endsWith;
        lodash.eq = eq;
        lodash.escape = escape2;
        lodash.escapeRegExp = escapeRegExp;
        lodash.every = every;
        lodash.find = find;
        lodash.findIndex = findIndex;
        lodash.findKey = findKey;
        lodash.findLast = findLast;
        lodash.findLastIndex = findLastIndex;
        lodash.findLastKey = findLastKey;
        lodash.floor = floor;
        lodash.forEach = forEach;
        lodash.forEachRight = forEachRight;
        lodash.forIn = forIn;
        lodash.forInRight = forInRight;
        lodash.forOwn = forOwn;
        lodash.forOwnRight = forOwnRight;
        lodash.get = get;
        lodash.gt = gt;
        lodash.gte = gte;
        lodash.has = has;
        lodash.hasIn = hasIn;
        lodash.head = head;
        lodash.identity = identity;
        lodash.includes = includes;
        lodash.indexOf = indexOf;
        lodash.inRange = inRange;
        lodash.invoke = invoke;
        lodash.isArguments = isArguments;
        lodash.isArray = isArray;
        lodash.isArrayBuffer = isArrayBuffer;
        lodash.isArrayLike = isArrayLike;
        lodash.isArrayLikeObject = isArrayLikeObject;
        lodash.isBoolean = isBoolean;
        lodash.isBuffer = isBuffer;
        lodash.isDate = isDate2;
        lodash.isElement = isElement;
        lodash.isEmpty = isEmpty;
        lodash.isEqual = isEqual;
        lodash.isEqualWith = isEqualWith;
        lodash.isError = isError;
        lodash.isFinite = isFinite2;
        lodash.isFunction = isFunction;
        lodash.isInteger = isInteger;
        lodash.isLength = isLength;
        lodash.isMap = isMap;
        lodash.isMatch = isMatch;
        lodash.isMatchWith = isMatchWith;
        lodash.isNaN = isNaN2;
        lodash.isNative = isNative;
        lodash.isNil = isNil;
        lodash.isNull = isNull;
        lodash.isNumber = isNumber;
        lodash.isObject = isObject;
        lodash.isObjectLike = isObjectLike;
        lodash.isPlainObject = isPlainObject;
        lodash.isRegExp = isRegExp;
        lodash.isSafeInteger = isSafeInteger;
        lodash.isSet = isSet;
        lodash.isString = isString;
        lodash.isSymbol = isSymbol;
        lodash.isTypedArray = isTypedArray;
        lodash.isUndefined = isUndefined;
        lodash.isWeakMap = isWeakMap;
        lodash.isWeakSet = isWeakSet;
        lodash.join = join;
        lodash.kebabCase = kebabCase;
        lodash.last = last;
        lodash.lastIndexOf = lastIndexOf;
        lodash.lowerCase = lowerCase;
        lodash.lowerFirst = lowerFirst;
        lodash.lt = lt;
        lodash.lte = lte;
        lodash.max = max;
        lodash.maxBy = maxBy;
        lodash.mean = mean;
        lodash.meanBy = meanBy;
        lodash.min = min;
        lodash.minBy = minBy;
        lodash.stubArray = stubArray;
        lodash.stubFalse = stubFalse;
        lodash.stubObject = stubObject;
        lodash.stubString = stubString;
        lodash.stubTrue = stubTrue;
        lodash.multiply = multiply;
        lodash.nth = nth;
        lodash.noConflict = noConflict;
        lodash.noop = noop4;
        lodash.now = now;
        lodash.pad = pad;
        lodash.padEnd = padEnd;
        lodash.padStart = padStart;
        lodash.parseInt = parseInt2;
        lodash.random = random;
        lodash.reduce = reduce;
        lodash.reduceRight = reduceRight;
        lodash.repeat = repeat;
        lodash.replace = replace;
        lodash.result = result;
        lodash.round = round;
        lodash.runInContext = runInContext2;
        lodash.sample = sample;
        lodash.size = size;
        lodash.snakeCase = snakeCase;
        lodash.some = some;
        lodash.sortedIndex = sortedIndex;
        lodash.sortedIndexBy = sortedIndexBy;
        lodash.sortedIndexOf = sortedIndexOf;
        lodash.sortedLastIndex = sortedLastIndex;
        lodash.sortedLastIndexBy = sortedLastIndexBy;
        lodash.sortedLastIndexOf = sortedLastIndexOf;
        lodash.startCase = startCase;
        lodash.startsWith = startsWith;
        lodash.subtract = subtract;
        lodash.sum = sum;
        lodash.sumBy = sumBy;
        lodash.template = template2;
        lodash.times = times;
        lodash.toFinite = toFinite;
        lodash.toInteger = toInteger;
        lodash.toLength = toLength;
        lodash.toLower = toLower;
        lodash.toNumber = toNumber;
        lodash.toSafeInteger = toSafeInteger;
        lodash.toString = toString;
        lodash.toUpper = toUpper;
        lodash.trim = trim;
        lodash.trimEnd = trimEnd;
        lodash.trimStart = trimStart;
        lodash.truncate = truncate;
        lodash.unescape = unescape2;
        lodash.uniqueId = uniqueId;
        lodash.upperCase = upperCase;
        lodash.upperFirst = upperFirst;
        lodash.each = forEach;
        lodash.eachRight = forEachRight;
        lodash.first = head;
        mixin(lodash, function() {
          var source = {};
          baseForOwn(lodash, function(func, methodName) {
            if (!hasOwnProperty.call(lodash.prototype, methodName)) {
              source[methodName] = func;
            }
          });
          return source;
        }(), { "chain": false });
        lodash.VERSION = VERSION;
        arrayEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(methodName) {
          lodash[methodName].placeholder = lodash;
        });
        arrayEach(["drop", "take"], function(methodName, index7) {
          LazyWrapper.prototype[methodName] = function(n) {
            n = n === undefined2 ? 1 : nativeMax(toInteger(n), 0);
            var result2 = this.__filtered__ && !index7 ? new LazyWrapper(this) : this.clone();
            if (result2.__filtered__) {
              result2.__takeCount__ = nativeMin(n, result2.__takeCount__);
            } else {
              result2.__views__.push({
                "size": nativeMin(n, MAX_ARRAY_LENGTH),
                "type": methodName + (result2.__dir__ < 0 ? "Right" : "")
              });
            }
            return result2;
          };
          LazyWrapper.prototype[methodName + "Right"] = function(n) {
            return this.reverse()[methodName](n).reverse();
          };
        });
        arrayEach(["filter", "map", "takeWhile"], function(methodName, index7) {
          var type = index7 + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
          LazyWrapper.prototype[methodName] = function(iteratee2) {
            var result2 = this.clone();
            result2.__iteratees__.push({
              "iteratee": getIteratee(iteratee2, 3),
              "type": type
            });
            result2.__filtered__ = result2.__filtered__ || isFilter;
            return result2;
          };
        });
        arrayEach(["head", "last"], function(methodName, index7) {
          var takeName = "take" + (index7 ? "Right" : "");
          LazyWrapper.prototype[methodName] = function() {
            return this[takeName](1).value()[0];
          };
        });
        arrayEach(["initial", "tail"], function(methodName, index7) {
          var dropName = "drop" + (index7 ? "" : "Right");
          LazyWrapper.prototype[methodName] = function() {
            return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
          };
        });
        LazyWrapper.prototype.compact = function() {
          return this.filter(identity);
        };
        LazyWrapper.prototype.find = function(predicate) {
          return this.filter(predicate).head();
        };
        LazyWrapper.prototype.findLast = function(predicate) {
          return this.reverse().find(predicate);
        };
        LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
          if (typeof path == "function") {
            return new LazyWrapper(this);
          }
          return this.map(function(value) {
            return baseInvoke(value, path, args);
          });
        });
        LazyWrapper.prototype.reject = function(predicate) {
          return this.filter(negate(getIteratee(predicate)));
        };
        LazyWrapper.prototype.slice = function(start, end) {
          start = toInteger(start);
          var result2 = this;
          if (result2.__filtered__ && (start > 0 || end < 0)) {
            return new LazyWrapper(result2);
          }
          if (start < 0) {
            result2 = result2.takeRight(-start);
          } else if (start) {
            result2 = result2.drop(start);
          }
          if (end !== undefined2) {
            end = toInteger(end);
            result2 = end < 0 ? result2.dropRight(-end) : result2.take(end - start);
          }
          return result2;
        };
        LazyWrapper.prototype.takeRightWhile = function(predicate) {
          return this.reverse().takeWhile(predicate).reverse();
        };
        LazyWrapper.prototype.toArray = function() {
          return this.take(MAX_ARRAY_LENGTH);
        };
        baseForOwn(LazyWrapper.prototype, function(func, methodName) {
          var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
            isTaker = /^(?:head|last)$/.test(methodName),
            lodashFunc = lodash[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName],
            retUnwrapped = isTaker || /^find/.test(methodName);
          if (!lodashFunc) {
            return;
          }
          lodash.prototype[methodName] = function() {
            var value = this.__wrapped__, args = isTaker ? [1] : arguments, isLazy = value instanceof LazyWrapper,
              iteratee2 = args[0], useLazy = isLazy || isArray(value);
            var interceptor = function(value2) {
              var result3 = lodashFunc.apply(lodash, arrayPush([value2], args));
              return isTaker && chainAll ? result3[0] : result3;
            };
            if (useLazy && checkIteratee && typeof iteratee2 == "function" && iteratee2.length != 1) {
              isLazy = useLazy = false;
            }
            var chainAll = this.__chain__, isHybrid = !!this.__actions__.length,
              isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
            if (!retUnwrapped && useLazy) {
              value = onlyLazy ? value : new LazyWrapper(this);
              var result2 = func.apply(value, args);
              result2.__actions__.push({ "func": thru, "args": [interceptor], "thisArg": undefined2 });
              return new LodashWrapper(result2, chainAll);
            }
            if (isUnwrapped && onlyLazy) {
              return func.apply(this, args);
            }
            result2 = this.thru(interceptor);
            return isUnwrapped ? isTaker ? result2.value()[0] : result2.value() : result2;
          };
        });
        arrayEach(["pop", "push", "shift", "sort", "splice", "unshift"], function(methodName) {
          var func = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru",
            retUnwrapped = /^(?:pop|shift)$/.test(methodName);
          lodash.prototype[methodName] = function() {
            var args = arguments;
            if (retUnwrapped && !this.__chain__) {
              var value = this.value();
              return func.apply(isArray(value) ? value : [], args);
            }
            return this[chainName](function(value2) {
              return func.apply(isArray(value2) ? value2 : [], args);
            });
          };
        });
        baseForOwn(LazyWrapper.prototype, function(func, methodName) {
          var lodashFunc = lodash[methodName];
          if (lodashFunc) {
            var key2 = lodashFunc.name + "";
            if (!hasOwnProperty.call(realNames, key2)) {
              realNames[key2] = [];
            }
            realNames[key2].push({ "name": methodName, "func": lodashFunc });
          }
        });
        realNames[createHybrid(undefined2, WRAP_BIND_KEY_FLAG).name] = [{
          "name": "wrapper",
          "func": undefined2
        }];
        LazyWrapper.prototype.clone = lazyClone;
        LazyWrapper.prototype.reverse = lazyReverse;
        LazyWrapper.prototype.value = lazyValue;
        lodash.prototype.at = wrapperAt;
        lodash.prototype.chain = wrapperChain;
        lodash.prototype.commit = wrapperCommit;
        lodash.prototype.next = wrapperNext;
        lodash.prototype.plant = wrapperPlant;
        lodash.prototype.reverse = wrapperReverse;
        lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
        lodash.prototype.first = lodash.prototype.head;
        if (symIterator) {
          lodash.prototype[symIterator] = wrapperToIterator;
        }
        return lodash;
      };
      var _ = runInContext();
      if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        root._ = _;
        define(function() {
          return _;
        });
      } else if (freeModule) {
        (freeModule.exports = _)._ = _;
        freeExports._ = _;
      } else {
        root._ = _;
      }
    }).call(exports);
  }
});

// node_modules/svelte-copy/copy.js
var init_copy = __esm({
  "node_modules/svelte-copy/copy.js"() {
    init_shims();
  }
});

// node_modules/svelte-copy/index.js
var init_svelte_copy = __esm({
  "node_modules/svelte-copy/index.js"() {
    init_shims();
    init_copy();
  }
});

// .svelte-kit/output/server/chunks/page-610407ff.js
var import_lodash, ___ASSET___1$1, ___ASSET___1, ___ASSET___0, Footer, favicon32, favicon16, faviconApple, css3, Page;
var init_page_610407ff = __esm({
  ".svelte-kit/output/server/chunks/page-610407ff.js"() {
    init_shims();
    init_index_43ce8bc5();
    import_lodash = __toESM(require_lodash(), 1);
    init_svelte_copy();
    ___ASSET___1$1 = "/_app/immutable/assets/logo-transparent-white-blue-ea29a596.png";
    ___ASSET___1 = "/_app/immutable/assets/bottomleft-4dc05747.svg";
    ___ASSET___0 = "/_app/immutable/assets/appstore_black-01825d9c.svg";
    Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let year = new Date().getFullYear();
      return `<div><div class="${"w-full left-0 bg-primaryBg p-6 mt-10"}"><div class="${"flex flex-row items-center justify-around sm:justify-center w-full sm:w-auto"}"><a href="${"https://github.com/neagdolph/peacebox"}" target="${"_blank"}"><p class="${"font-baloo2 text-xl text-light whitespace-nowrap"}"><i class="${"fa-brands fa-github fa-md sm:fa-lg"}"></i> \xA0Github
        </p></a>
      <div class="${"min-w-2 w-2 sm:min-w-6 sm:w-6 h-0.5 rounded-full bg-light mx-3 sm:mx-12"}"></div>
      <a href="${"https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336"}" class="${"hidden sm:block"}"><img${add_attribute("src", ___ASSET___0, 0)} class="${"w-44 borderAppStore min-w-32"}"></a>
      <div class="${"min-w-2 w-2 sm:min-w-6 sm:w-6 h-0.5 rounded-full bg-light mx-3 sm:mx-12 hidden sm:block"}"></div>
      <a href="${"mailto:contact@peacebox.app"}" target="${"_blank"}"><p class="${"font-baloo2 text-xl text-light whitespace-nowrap"}"><i class="${"fa-solid fa-envelope fa-md sm:fa-lg"}"></i> \xA0Email
        </p></a></div>
    <div class="${"flex flex-row items-center justify-around sm:justify-center w-full sm:w-auto my-4"}"><a href="${"/privacy"}"><p class="${"font-baloo2 text-md text-light whitespace-nowrap"}">\xA0 Privacy
        </p></a>
      <div class="${"min-w-2 w-2 sm:min-w-6 sm:w-6 h-0.5 rounded-full bg-light mx-3 sm:mx-12 hidden sm:block"}"></div>
      <a href="${"/terms"}"><p class="${"font-baloo2 text-md text-light whitespace-nowrap"}">\xA0 Terms
        </p></a>
      <div class="${"min-w-2 w-2 sm:min-w-6 sm:w-6 h-0.5 rounded-full bg-light mx-3 sm:mx-12 hidden sm:block"}"></div>
      <a href="${"/license"}"><p class="${"font-baloo2 text-md text-light whitespace-nowrap"}">\xA0 License
        </p></a></div>
    <div class="${"mx-auto"}"><p class="${"font-roboto text-md text-light text-center"}">\xA9 <span id="${"copyright"}">${escape(year || 2022)}</span> Neil Agrawal
      </p></div></div></div>`;
    });
    favicon32 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABZhJREFUWEedV29MU1cU/z3oKOBiH9VRoWAQCKFzcf6pXaYkE01qMhMX+wqpZAbmB74zSGAsGIks3Ui6+BWXqInxC1KMfiDQzWwzkMgyBziSAouzQqtFIc8YKZqBXe59f/re63uU7X5p333vnPM75/zOOfcyAAMgCfrLkF/xUfiXvhgGSIrfSaKyDvK5vCnKinpFEUmhbFWpg9jXfCd8r2tIiY18kAm5gT+6TkpB0DpjFBUjJZvAJEE3hpceEqaqqqrY5/M5DzqdrhyzuWB2dva34MDA+K937/4FYO2/4FED0PGYZVnW5/PtPVJb6youKnKxLOsqttvt26zWLJE51N5KIoGF+fllnufvx+Pxe6Ojo+O3bt36/eHDh882CpwIQLZsPvnZyfdPfHrCVVFZ4SpgC1w2m62qqKgoJysrS6VHaVzPQDKZxPPnz9efxJ78zb/g7z169IgAGr99+/Y0gNcSsQinKfHcx90HWr9s/cVms72bl5cHu92OLflbZBJSg4SkhNSputHY1oe1urqKaDSKRCKBxcXFV4FA4EgoFLov8Zsq8Xg8h4PB4CiBs77+FtFoDInEimzMarWisLAQDIWsWDo2X/AvEF+Mg0SBrNzcXJSWlML0jok+cxxXMzg4OEZckbWlAOhnbHl5Gc+epdJpNudgZ+lOZJtM1BgxKi2WZbFjxw4FWInJgjkK4ObNMdJPNg1A6lVSZb15/ZqGdWFhAfv27QMxmiEw8utUBKQYJJUpAK5du0aVO51O7N9/ANu2WQ2JHJ4Jw1Ht0H9PUiCzLJU6TQoESilT0NLSgosXL1KlJOeVlZU4e/Ys2traYDJli61RsBkOh+FwKABkKg8VB4QBkAaAGAoEAmleeb1e9Pf3q3IbDs/A4aimoGTbShA6gOQIiNYpBBKBAVoFQHt7O3p7e3XD2n+jH3XeOvmdMgKbcF5TBYL7dHk4z+HggACg86tO+L/10/3GxkY8mJrCxOQkfXa73RgZGdEFYEgUDT05rq5mcDA4JsWfhs/jOUUjQBB1dXWhp6eHihFClpSUoLa2llathbWA53kNACEFm11CCm6OEe7JbSWVgiTOn+9Gd3c31XfadxpbLVvR19cn619bW0N2NiGjloQ6SdDpnuoylFIgcoD4caHnAs51nUtziLzLy9+ClZVXGVKwARuSAOfN0An9fj86v+7UPZ0cPXoUP925Ix+eaB9QlqE0J+QeIGFNgdqwEZHPer/rRUdHO5UkuY/FYpibmwOZB8PDIzjodMopVzeizdWBYQqEYQR8Hwigta2Nku7ylctoamzC0/hTWCwW5Ofnq1JDyrDa4VBT0AiHuJ8OgAE8p6RpCNoFSTck6/KVK/iiqUk8t2o0JwE5BdK8NqoGhWhGAC9fvkQwGMT169fR2NiEM2c+T50ANBhmaARIGZKlKMUNuqGX42qCdBwrJDjOc3hAbETKGJOZnnYGoHCEUSq0YoNhRBQpgAgyjHweIP/lWXXc7a7+xu+/sauszFFgtWar2woRVR0f0spwM/Tjef5tJBIJd3R0eEOh0IwmZoKB3R/sLm1ubj6258M97ve2bz9WUVFZaDabqUHJA2WEVNNQ5S2wvraGSCTCx+Pxn6f/nB6+9MOl0MTExGPJsOyUfCFJPxWbOI7bW19f7y4rK3MXFxd/ZLfbc1MpSaalYGlpaX3+8fyDaCw6PDQ0NNzX1zcOhnkj36Y07c24gWsvOwxQvqvc0tDQ8ElNTY3bVmhzl1eUV0QikaycnJyleDx+Z3Jycvjq1as/Tk1NxQROKq5xOoOCmNAey8XjgXBYFDKvDJhCCwPm0MeHylmW3T40NPQHgH+M7KludhIxJc3/5/aVktFKi88ZlCrlJVdTt+P0q5hO8DJs6VyIjUDLHNADnban2aDCG6fZkAZSuv4FwgODSDkcvF8AAAAASUVORK5CYII=";
    favicon16 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAqRJREFUOE9VU01PE1EUPQ9KKWlpmziDDWmAglLiwsYFBNCCpKUm8hMkMRkWan+CILaxriS4ItFF8VdIgAAGJVE21sYu+JBOqyLKTENpMSRIGHPfm1Z8mczHnXfPPee8exnAAGbQBYPez90ZDBgiBAb+Ze5AdTHGAKOyywxTsKOjo358/OFVh73R9uRp4uPndPq3UUkTNTk4AdOqicXil4ZDoZ6LHk+PzdbQ0+hwBJwup41+lo+O/pRLpczx8fG6pmkfFhYW1+Oxx1sG2BkjhNV3b1/4Oy/fY6yW83W5XLBarYK7KIPT01MUi0WiizPDwObW5svB4MB9Xj+rqsm2tlalorN0WMLJyQmnRk+rtR51FgvcbheEZ0Aul5v1tfvGuAQ1qyZ3d38oU1PP0N3djdE7o2hpbeEE9IIGSZKEeoPBMA3P5XOzPl/7GIdT1Wxy+8u2EolEuCmUkMlkIDc1Qdc0yLJMzCvFORZnQACkgSRksztKOBTG+MQEEokEZmZmEI1GoWnEQAbfKFzhJ6Dmc7MdJIHiO6qa/JrPKzeHhnAtEEDqUxrxeAyTk4+g6zoHMFOrT8GAPAC4hO/fdpWBgSCam5vxa38fKytvELxxHbpegCRXPBAyuASVTDwn4efentLX349UKoUufxdsDbwFuAeSLFe5i14E8v8zUJNer1dZXl5GIBCAx+MRWmFA0wuQJcn8/ucDSWgXHjC8npsb9Ps77zrsjmFJkrystsasQwA65AsSyEU6iUJB2yuXjxY3NjZejdweWeUm8h4352j6+fSVcCgccbvdt5xOV/DgoFBnsdS9LxaL82tra/PR6IM0NSNPqcyCmESBIoaLfhro7e1rsDvs1qWlpUNqIorxfji3TE/N5KpSc5cJVu0gPtZmR/HhBv4C7wMsLczBVQQAAAAASUVORK5CYII=";
    faviconApple = "/_app/immutable/assets/apple-touch-icon-ed367713.png";
    css3 = {
      code: "@-webkit-keyframes svelte-neojkv-rotating{from{-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes svelte-neojkv-rotating{from{-ms-transform:rotate(0deg);-moz-transform:rotate(0deg);-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg)}to{-ms-transform:rotate(360deg);-moz-transform:rotate(360deg);-webkit-transform:rotate(360deg);-o-transform:rotate(360deg);transform:rotate(360deg)}}.rotating.svelte-neojkv{-webkit-animation:svelte-neojkv-rotating 5s linear infinite;-moz-animation:svelte-neojkv-rotating 2s linear infinite;-ms-animation:svelte-neojkv-rotating 2s linear infinite;-o-animation:svelte-neojkv-rotating 2s linear infinite;animation:svelte-neojkv-rotating 20s linear infinite}#rotateDiv.svelte-neojkv{right:60px;top:750px;width:200px;height:200px;position:absolute}",
      map: null
    };
    Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let topRight1, topRight2, ring, documentEl;
      let opacityLogo, innerLogo;
      let { home } = $$props;
      if ($$props.home === void 0 && $$bindings.home && home !== void 0)
        $$bindings.home(home);
      $$result.css.add(css3);
      return `

${$$result.head += `<link rel="${"apple-touch-icon"}" sizes="${"180x180"}"${add_attribute("href", faviconApple, 0)} data-svelte="svelte-1c1qfbn"><link rel="${"icon"}" type="${"image/png"}" sizes="${"32x32"}"${add_attribute("href", favicon32, 0)} data-svelte="svelte-1c1qfbn"><link rel="${"icon"}" type="${"image/png"}" sizes="${"16x16"}"${add_attribute("href", favicon16, 0)} data-svelte="svelte-1c1qfbn">`, ""}

<div class="${"h-0"}">
  <div id="${"rotateDiv"}" class="${"relative h-100 w-full flex justify-end items-center translate-y-30 svelte-neojkv"}"><div class="${"w-48 h-48 flex absolute justify-center items-center"}"><div class="${"absolute top-0 h-48 w-48 flex justify-center items-center verticalHack"}"${add_attribute("this", opacityLogo, 0)}><div style="${"opacity: 0"}" class="${"innerLogo w-20 h-20 box-border shadow-md bg-white bg-opacity-10 rounded-full shadow-sm flex justify-center items-center"}"${add_attribute("this", innerLogo, 0)}><img class="${"w-16 h-16 opacity-80"}"${add_attribute("src", ___ASSET___1$1, 0)}></div></div>
      <svg viewBox="${"0 0 200 200"}" class="${"w-48 h-48 rotating svelte-neojkv"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"><g id="${"closed"}"${add_attribute("this", ring, 0)}><circle id="${"10"}" cx="${"100"}" cy="${"100"}" r="${"50"}" fill="${"#6062FF"}" fill-opacity="${"0.37"}"></circle><circle id="${"9"}" cx="${"100"}" cy="${"100"}" r="${"50"}" fill="${"#6062FF"}" fill-opacity="${"0.37"}"></circle><circle id="${"8"}" cx="${"100"}" cy="${"100"}" r="${"50"}" fill="${"#6062FF"}" fill-opacity="${"0.37"}"></circle><circle id="${"7"}" cx="${"100"}" cy="${"100"}" r="${"50"}" fill="${"#6062FF"}" fill-opacity="${"0.37"}"></circle><circle id="${"6"}" cx="${"100"}" cy="${"100"}" r="${"50"}" fill="${"#6062FF"}" fill-opacity="${"0.37"}"></circle><circle id="${"5"}" cx="${"100"}" cy="${"100"}" r="${"50"}" fill="${"#6062FF"}" fill-opacity="${"0.37"}"></circle><circle id="${"4"}" cx="${"100"}" cy="${"100"}" r="${"50"}" fill="${"#6062FF"}" fill-opacity="${"0.37"}"></circle><circle id="${"3"}" cx="${"100"}" cy="${"100"}" r="${"50"}" fill="${"#6062FF"}" fill-opacity="${"0.37"}"></circle><circle id="${"2"}" cx="${"100"}" cy="${"100"}" r="${"50"}" fill="${"#6062FF"}" fill-opacity="${"0.37"}"></circle><circle id="${"1"}" cx="${"100"}" cy="${"100"}" r="${"50"}" fill="${"#6062FF"}" fill-opacity="${"0.37"}"></circle><circle id="${"main"}" cx="${"100"}" cy="${"100"}" r="${"50"}" fill="${"#6062FF"}" fill-opacity="${"0.8"}"></circle></g></svg></div></div>

  
  <img${add_attribute("src", ___ASSET___1, 0)} class="${"fixed bottomHack left-0 w-96 lg:w-124 below2"}" alt="${"Bottom-left background image"}">

  
  <svg class="${"fixed top-0 right-0 w-96 lg:w-124 below2"}" viewBox="${"0 20 550 510"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("this", topRight2, 0)}><path opacity="${"0"}" id="${"a1"}" d="${"M547.461 510C477.611 495.92 407.964 482.027 344.39 456.87C281.019 431.713 223.924 395.292 170.879 351.549C118.036 307.618 69.4449 256.177 41.7074 196.664C13.7675 137.151 6.88375 69.7527 0 2.35445H547.461V510Z"}" fill="${"#EEF4FA"}"></path><path opacity="${"0"}" id="${"a2"}" d="${"M550 410.531C493.676 399.195 437.135 387.858 385.832 367.413C334.53 347.17 288.248 317.817 245.46 282.392C202.671 246.764 163.376 205.265 140.89 157.087C118.404 109.11 112.947 54.454 107.271 0H550V410.531Z"}" fill="${"#D6E9FB"}"></path><path opacity="${"0"}" id="${"a3"}" d="${"M547.461 322.245C503.25 313.426 458.782 304.369 418.684 288.399C378.328 272.43 342.086 249.549 308.413 221.662C274.998 193.776 243.896 161.122 226.417 123.225C208.682 85.5664 204.312 42.9024 199.942 4.03627e-06H547.461V322.245Z"}" fill="${"#BEDFFD"}"></path><path opacity="${"0"}" id="${"a4"}" d="${"M548.094 198.939C520.8 193.495 493.348 187.903 468.593 178.044C443.68 168.186 421.305 154.06 400.518 136.844C379.889 119.628 360.688 99.4697 349.897 76.0739C338.948 52.8252 336.25 26.4865 333.553 0.000645665H548.094V198.939Z"}" fill="${"#A3D4FE"}"></path><path opacity="${"0"}" id="${"a5"}" d="${"M548.094 99.4697C534.447 96.674 520.8 94.0254 508.264 89.0225C495.887 84.1668 484.62 76.9568 474.306 68.4224C463.991 59.741 454.47 49.7352 448.916 38.1109C443.521 26.4865 442.252 13.2436 440.823 0.000656891L548.094 0.000645665L548.094 99.4697Z"}" fill="${"#95CFFF"}"></path></svg>

  <svg class="${"fixed top-0 right-0 w-96 lg:w-124 below2"}" viewBox="${"0 20 550 510"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("this", topRight1, 0)}><path id="${"b1"}" d="${"M549.989 510C472.27 507.575 394.696 505.285 339.494 471.204C284.437 437.124 251.752 371.252 201.779 322.892C151.806 274.532 84.5467 243.685 48.0841 192.765C11.4763 141.846 5.81077 70.9905 0 0H549.989V510Z"}" fill="${"#EEF4FA"}"></path><path id="${"b2"}" d="${"M549.992 408.027C487.817 406.141 425.787 404.255 381.625 376.91C337.463 349.699 311.315 297.028 271.366 258.368C231.417 219.707 177.667 194.921 148.468 154.239C119.269 113.558 114.62 56.7116 109.972 0H549.992V408.027Z"}" fill="${"#D6E9FB"}"></path><path id="${"b3"}" d="${"M549.994 305.919C503.363 304.572 456.877 303.09 423.755 282.75C390.634 262.274 371.023 222.805 341.097 193.708C311.026 164.746 270.787 146.157 248.851 115.713C226.916 85.1347 223.429 42.5674 220.088 0H549.994V305.919Z"}" fill="${"#BEDFFD"}"></path><path id="${"b4"}" d="${"M550 203.946C518.912 203.003 487.825 202.06 465.744 188.455C443.808 174.849 430.734 148.447 410.687 129.184C390.785 109.786 363.765 97.5277 349.238 77.0523C334.566 56.7115 332.387 28.4231 330.062 0H550V203.946Z"}" fill="${"#A3D4FE"}"></path><path id="${"b5"}" d="${"M549.986 101.973C534.442 101.569 518.899 101.03 507.858 94.2947C496.818 87.4247 490.281 74.2234 480.402 64.5245C470.379 54.9604 456.869 48.7638 449.605 38.5261C442.342 28.4231 441.18 14.1442 440.018 0H549.986V101.973Z"}" fill="${"#95CFFF"}"></path></svg></div>
<div class="${"siteWrapper"}"${add_attribute("this", documentEl, 0)}><div class="${"flex flex-row h-28 items-center sm:pl-8 lg:pl-16 border-b border-gray-900 justify-between header w-full"}"><div class="${"flex flex-row"}">${home === "true" ? `<p class="${"text-black font-futura font-bold tracking-tight text-5xl hidden sm:block"}">PeaceBox</p>` : `<a href="${"/"}"><p class="${"text-black font-futura font-bold tracking-tight text-5xl hidden sm:block"}">PeaceBox</p></a>`}

      <div class="${"max-w-28 min-w-24 pr-3 sm:hidden"}"><p class="${"text-black font-futura font-bold tracking-tight text-7xl pl-4"}">P</p></div></div>
    <div class="${"flex flex-row h-full items-center"}"><div class="${"mr-4 md:mr-8 lg:mr-12 py-2"}"><a href="${"mailto:contact@peacebox.app"}" target="${"_blank"}"><p class="${"font-baloo2 text-md whitespace-nowrap"}"><i class="${"fa-solid fa-envelope fa-md"}"></i> \xA0Email</p></a></div>
      <div class="${"mr-6 md:mr-10 lg:mr-14 py-2 hidden sm:block"}"><a href="${"https://github.com/neagdolph/peacebox"}" target="${"_blank"}"><p class="${"font-baloo2 text-md"}"><i class="${"fa-brands fa-github fa-md"}"></i> \xA0Github</p></a></div>
      <div class="${"h-full px-4 sm:px-8 hidden sm:flex border-l border-gray-900 items-center"}"><a href="${"https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336"}"><div class="${"border-2 rounded-sm border-gray-900 px-2 sm:px-3 py-1"}"><p class="${"font-baloo2 text-lg whitespace-nowrap"}"><i class="${"fa-solid fa-cloud-arrow-down"}"></i> \xA0Download
            </p></div></a></div>
      <div class="${"h-full pr-8 pl-4 block sm:hidden border-gray-900 flex items-center"}"><a href="${"https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336"}"><i class="${"fa-solid fa-cloud-arrow-down fa-2x"}"></i></a></div></div></div>
  ${slots.default ? slots.default({}) : ``}
  ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}</div>`;
    });
  }
});

// .svelte-kit/output/server/chunks/github_button-e736b920.js
var Github_button;
var init_github_button_e736b920 = __esm({
  ".svelte-kit/output/server/chunks/github_button-e736b920.js"() {
    init_shims();
    init_index_43ce8bc5();
    Github_button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `<a href="${"https://github.com/neagdolph/peacebox"}" target="${"_blank"}"><p class="${"font-baloo2 text-lg sm:text-xl whitespace-nowrap text-primary"}"><i class="${"fa-brands fa-github fa-md sm:fa-lg"}"></i> \xA0
    Github
  </p></a>`;
    });
  }
});

// .svelte-kit/output/server/entries/pages/index.svelte.js
var index_svelte_exports = {};
__export(index_svelte_exports, {
  default: () => Routes
});

function writable2(value, start = noop2) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();

  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue2.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue2.push(subscriber, value);
        }
        if (run_queue) {
          for (let i2 = 0; i2 < subscriber_queue2.length; i2 += 2) {
            subscriber_queue2[i2][0](subscriber_queue2[i2 + 1]);
          }
          subscriber_queue2.length = 0;
        }
      }
    }
  }

  function update(fn) {
    set(fn(value));
  }

  function subscribe(run2, invalidate = noop2) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop2;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }

  return { set, update, subscribe };
}

var import_lodash2, ___ASSET___02, ___ASSET___2, subscriber_queue2, settings, Share_modal, Routes;
var init_index_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/index.svelte.js"() {
    init_shims();
    init_index_43ce8bc5();
    init_page_610407ff();
    init_github_button_e736b920();
    init_svelte_copy();
    import_lodash2 = __toESM(require_lodash(), 1);
    ___ASSET___02 = "/_app/immutable/assets/appstore-3c23a8b2.svg";
    ___ASSET___2 = "/_app/immutable/assets/homepage_image2-a202bca2.png";
    subscriber_queue2 = [];
    settings = writable2({
      APPURL: "https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336"
    });
    Share_modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let copyInput;
      let APPURL;
      settings.subscribe((value) => {
        APPURL = value.APPURL;
      });
      return `
<div class="${"mx-4 sm:mx-8"}"><i class="${"fa fa-share fa-xl"}"></i></div>


<div id="${"defaultModal"}" tabindex="${"-1"}" aria-hidden="${"true"}" class="${escape("hidden") + " overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full bg-black bg-opacity-40 md:inset-0 h-modal md:h-full"}"><div class="${"mt-40 mx-auto relative p-4 w-full max-w-2xl h-full md:h-auto"}">
    <div class="${"relative bg-white rounded-lg shadow bg-white"}">
      <div class="${"flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600"}"><h3 class="${"text-2xl font-semibold text-gray-900 dark:text-black"}">Share
        </h3>
        <button type="${"button"}" class="${"text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"}" data-modal-toggle="${"defaultModal"}"><svg class="${"w-5 h-5"}" fill="${"currentColor"}" viewBox="${"0 0 20 20"}" xmlns="${"http://www.w3.org/2000/svg"}"><path fill-rule="${"evenodd"}" d="${"M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"}" clip-rule="${"evenodd"}"></path></svg></button></div>
      
      <div class="${"p-6 space-y-6"}"><p class="${"text-lg leading-relaxed text-gray-500 dark:text-gray-800"}">PeaceBox can be downloaded on the iOS App Store at this URL
        </p>
        <div class="${"justify-center flex flex-nowrap items-center"}"><div class="${"h-10 w-96 flex justify-start items-center relative"}"><div class="${"h-12 w-96 absolute top-0 left-0 m-0 p-0 rounded-md bg-white border-2 border-green-400 px-3 py-2 text-md " + escape("hidden")}">Copied! \u{1F389}
            </div>
            <input class="${"mt-2 h-15 w-96 outline-0 border-2 rounded-md border-blue-300 shadow px-3 py-2 text-md"}"${add_attribute("this", copyInput, 0)}${add_attribute("value", APPURL, 0)}></div>
          <button class="${"mt-2 ml-2 bottom-0 h-auto leading-4 rounded-md h-fulloutline-0 border border-black shadow px-4 py-3 text-xl font-baloo2 text-gray-900"}">Copy
          </button></div>
        <br>
        <p class="${"text-lg leading-relaxed text-gray-500 dark:text-gray-800"}">Share with friends
        </p></div>
      
      <div class="${"flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600"}"><button type="${"button"}" class="${"text-white text-lg bg-red-300 hover:bg-red-200 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-400 dark:hover:bg-red-200 dark:focus:ring-red-500"}">Close
        </button></div></div></div></div>`;
    });
    Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Page, "Page").$$render($$result, { home: "true" }, {}, {
        default: () => {
          return `<div class="${"mainContainer"}"><div class="${"sm:px-8 lg:px-16 flex flex-row justify-between items-center justify-center w-full h-full innerContainer"}"><div class="${"justify-center flex w-full basis-full md:basis-2/3 lg:basis-3/5 sm:mr-10 px-4 lg:px-0"}"><div class="${"container w-fit max-w-xl"}"><p class="${"text-5xl sm:text-6xl lg:text-7xl font-vollkorn font-light text-primary"}">Hi, I&#39;m PeaceBox</p>
          <p class="${"text-lg font-baloo2 font-extralight sm:max-w-prose mt-8 mb-3 text-primary sm:pl-1.5"}">We all deal with stress and anxiety in our lives but most of us don&#39;t know how to effectively let go of it.
          </p>
          <p class="${"text-lg font-baloo2 font-extralight sm:max-w-prose mb-10 text-primary mt-6 sm:mt-0 sm:pl-1.5"}">PeaceBox is like a toolbox for your mind with the tools and techniques you need to relax and de-stress.
          </p>
          <div class="${"flex flex-row items-center justify-start"}">${validate_component(Share_modal, "ShareModal").$$render($$result, {}, {}, {})}
            <a href="${"https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336"}"><img${add_attribute("src", ___ASSET___02, 0)} class="${"w-44 borderAppStore min-w-32"}"></a>
            <div class="${"mx-4 sm:mx-16"}">${validate_component(Github_button, "GithubButton").$$render($$result, {}, {}, {})}</div></div></div></div>
      <div class="${"items-center -translate-y-3 md:-translate-y-0 md:mt-10 w-full hidden md:flex fixed opacity-30 md:opacity-100 md:relative basis-1/3 lg:basis-2/5"}"><div class="${"w-40 w-40 md:w-56 md:h-56 lg:h-72 lg:w-72 rounded-5xl lg:rounded-6xl mx-auto logoMain opacityLogo"}"><img${add_attribute("src", ___ASSET___1$1, 0)}></div></div></div></div>
  <div class="${"my-80 md:mt-32"}"><div class="${"sm:px-4 lg:px-4 flex flex-col md:flex-row justify-between items-center justify-center w-full"}"><div class="${"z-0 items-center sm:-translate-y-3 md:-translate-y-0 md:mt-10 w-3/2 sm:w-full flex md:fixed md:relative basis-full md:basis-1/2"}"><div class="${"rounded-5xl lg:rounded-6xl mx-auto absolute smallTapes md:tapesImage"}"><img${add_attribute("src", ___ASSET___2, 0)}></div></div>

      <div class="${"justify-center flex basis-1/2 px-4 lg:px-0 mx-4 z-10 sm:mr-5 mobileCard lg:antiMobileCard"}"><div class="${"container w-full md:w-fit md:max-w-xl"}"><p class="${"text-5xl sm:text-6xl lg:text-6xl font-vollkorn font-light text-primary sm:whitespace-nowrap"}">Don&#39;t Pay for Peace \xA0<i class="${"fa-solid fa-hand-peace fa-sm"}"></i></p>
          <p class="${"text-lg font-baloo2 font-extralight sm:max-w-prose mt-8 mb-3 text-primary sm:pl-1.5"}">With journaling tools, breathing exercises, and audio meditation tapes, you&#39;ll always have your mental toolbox in your back pocket
          </p>
          <p class="${"text-lg font-vollkorn font-extralight sm:max-w-prose mt-8 mb-3 text-primary sm:pl-1.5"}">PeaceBox is completely <strong class="${"font-bold"}">free</strong> and will never have ads. Content and tools are available to all users free of cost.
          </p>
          <a href="${"https://apps.apple.com/us/app/peacebox-tools-for-your-mind/id1592436336"}"><img${add_attribute("src", ___ASSET___02, 0)} class="${"w-32 mt-10 borderAppStore min-w-20"}"></a></div></div></div></div>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/2.js
var __exports3 = {};
__export(__exports3, {
  css: () => css4,
  entry: () => entry3,
  index: () => index3,
  js: () => js3,
  module: () => index_svelte_exports
});
var index3, entry3, js3, css4;
var init__3 = __esm({
  ".svelte-kit/output/server/nodes/2.js"() {
    init_shims();
    init_index_svelte();
    index3 = 2;
    entry3 = "pages/index.svelte-d450e232.js";
    js3 = ["pages/index.svelte-d450e232.js", "chunks/index-ceb1e3f7.js", "chunks/page-78720293.js", "chunks/preload-helper-60cab3ee.js", "chunks/github_button-efffc229.js", "chunks/index-01a167d0.js"];
    css4 = ["assets/page-c43c69cf.css"];
  }
});

// .svelte-kit/output/server/entries/pages/license.svelte.js
var license_svelte_exports = {};
__export(license_svelte_exports, {
  default: () => License
});
var import_lodash3, License;
var init_license_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/license.svelte.js"() {
    init_shims();
    init_index_43ce8bc5();
    init_page_610407ff();
    init_github_button_e736b920();
    import_lodash3 = __toESM(require_lodash(), 1);
    init_svelte_copy();
    License = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Page, "Page").$$render($$result, { home: "false" }, {}, {
        default: () => {
          return `<div class="${"mx-auto my-20 max-w-5xl mt-24 font-baloo2 px-20"}"><div class="${"mb-10"}">${validate_component(Github_button, "GithubButton").$$render($$result, {}, {}, {})}</div>

    <h1 class="${"font-vollkorn text-3xl my-6"}"><strong>Source Code Licensing</strong></h1>


    <h1 class="${"font-vollkorn text-2xl"}">Mozilla Public License Version 2.0</h1>
    <h2 id="${"1-definitions"}">1. Definitions</h2>
    <p class="${"my-4"}">1.1. &quot;Contributor&quot;
      means each individual or legal entity that creates, contributes to
      the creation of, or owns Covered Software.</p>
    <p class="${"my-4"}">1.2. &quot;Contributor Version&quot;
      means the combination of the Contributions of others (if any) used
      by a Contributor and that particular Contributor&#39;s Contribution.</p>
    <p class="${"my-4"}">1.3. &quot;Contribution&quot;
      means Covered Software of a particular Contributor.</p>
    <p class="${"my-4"}">1.4. &quot;Covered Software&quot;
      means Source Code Form to which the initial Contributor has attached
      the notice in Exhibit A, the Executable Form of such Source Code
      Form, and Modifications of such Source Code Form, in each case
      including portions thereof.</p>
    <p class="${"my-4"}">1.5. &quot;Incompatible With Secondary Licenses&quot;
      means</p>
    (a) that the initial Contributor has attached the notice described
    in Exhibit B to the Covered Software; or

    (b) that the Covered Software was made available under the terms of
    version 1.1 or earlier of the License, but not also under the
    terms of a Secondary License.
    <p class="${"my-4"}">1.6. &quot;Executable Form&quot;
      means any form of the work other than Source Code Form.</p>
    <p class="${"my-4"}">1.7. &quot;Larger Work&quot;
      means a work that combines Covered Software with other material, in
      a separate file or files, that is not Covered Software.</p>
    <p class="${"my-4"}">1.8. &quot;License&quot;
      means this document.</p>
    <p class="${"my-4"}">1.9. &quot;Licensable&quot;
      means having the right to grant, to the maximum extent possible,
      whether at the time of the initial grant or subsequently, any and
      all of the rights conveyed by this License.</p>
    <p class="${"my-4"}">1.10. &quot;Modifications&quot;
      means any of the following:</p>
    (a) any file in Source Code Form that results from an addition to,
    deletion from, or modification of the contents of Covered
    Software; or

    (b) any new file in Source Code Form that contains any Covered
    Software.
    <p class="${"my-4"}">1.11. &quot;Patent Claims&quot; of a Contributor
      means any patent claim(s), including without limitation, method,
      process, and apparatus claims, in any patent Licensable by such
      Contributor that would be infringed, but for the grant of the
      License, by the making, using, selling, offering for sale, having
      made, import, or transfer of either its Contributions or its
      Contributor Version.</p>
    <p class="${"my-4"}">1.12. &quot;Secondary License&quot;
      means either the GNU General Public License, Version 2.0, the GNU
      Lesser General Public License, Version 2.1, the GNU Affero General
      Public License, Version 3.0, or any later versions of those
      licenses.</p>
    <p class="${"my-4"}">1.13. &quot;Source Code Form&quot;
      means the form of the work preferred for making modifications.</p>
    <p class="${"my-4"}">1.14. &quot;You&quot; (or &quot;Your&quot;)
      means an individual or a legal entity exercising rights under this
      License. For legal entities, &quot;You&quot; includes any entity that
      controls, is controlled by, or is under common control with You. For
      purposes of this definition, &quot;control&quot; means (a) the power, direct
      or indirect, to cause the direction or management of such entity,
      whether by contract or otherwise, or (b) ownership of more than
      fifty percent (50%) of the outstanding shares or beneficial
      ownership of such entity.</p>
    <h2 id="${"2-license-grants-and-conditions"}">2. License Grants and Conditions</h2>
    <p class="${"my-4"}">2.1. Grants</p>
    <p class="${"my-4"}">Each Contributor hereby grants You a world-wide, royalty-free,
      non-exclusive license:</p>
    <p class="${"my-4"}">(a) under intellectual property rights (other than patent or trademark)
      Licensable by such Contributor to use, reproduce, make available,
      modify, display, perform, distribute, and otherwise exploit its
      Contributions, either on an unmodified basis, with Modifications, or
      as part of a Larger Work; and</p>
    <p class="${"my-4"}">(b) under Patent Claims of such Contributor to make, use, sell, offer
      for sale, have made, import, and otherwise transfer either its
      Contributions or its Contributor Version.</p>
    <p class="${"my-4"}">2.2. Effective Date</p>
    <p class="${"my-4"}">The licenses granted in Section 2.1 with respect to any Contribution
      become effective for each Contribution on the date the Contributor first
      distributes such Contribution.</p>
    <p class="${"my-4"}">2.3. Limitations on Grant Scope</p>
    <p class="${"my-4"}">The licenses granted in this Section 2 are the only rights granted under
      this License. No additional rights or licenses will be implied from the
      distribution or licensing of Covered Software under this License.
      Notwithstanding Section 2.1(b) above, no patent license is granted by a
      Contributor:</p>
    <p class="${"my-4"}">(a) for any code that a Contributor has removed from Covered Software;
      or</p>
    <p class="${"my-4"}">(b) for infringements caused by: (i) Your and any other third party&#39;s
      modifications of Covered Software, or (ii) the combination of its
      Contributions with other software (except as part of its Contributor
      Version); or</p>
    <p class="${"my-4"}">(c) under Patent Claims infringed by Covered Software in the absence of
      its Contributions.</p>
    <p class="${"my-4"}">This License does not grant any rights in the trademarks, service marks,
      or logos of any Contributor (except as may be necessary to comply with
      the notice requirements in Section 3.4).</p>
    <p class="${"my-4"}">2.4. Subsequent Licenses</p>
    <p class="${"my-4"}">No Contributor makes additional grants as a result of Your choice to
      distribute the Covered Software under a subsequent version of this
      License (see Section 10.2) or under the terms of a Secondary License (if
      permitted under the terms of Section 3.3).</p>
    <p class="${"my-4"}">2.5. Representation</p>
    <p class="${"my-4"}">Each Contributor represents that the Contributor believes its
      Contributions are its original creation(s) or it has sufficient rights
      to grant the rights to its Contributions conveyed by this License.</p>
    <p class="${"my-4"}">2.6. Fair Use</p>
    <p class="${"my-4"}">This License is not intended to limit any rights You have under
      applicable copyright doctrines of fair use, fair dealing, or other
      equivalents.</p>
    <p class="${"my-4"}">2.7. Conditions</p>
    <p class="${"my-4"}">Sections 3.1, 3.2, 3.3, and 3.4 are conditions of the licenses granted
      in Section 2.1.</p>
    <h2 id="${"3-responsibilities"}">3. Responsibilities</h2>
    <p class="${"my-4"}">3.1. Distribution of Source Form</p>
    <p class="${"my-4"}">All distribution of Covered Software in Source Code Form, including any
      Modifications that You create or to which You contribute, must be under
      the terms of this License. You must inform recipients that the Source
      Code Form of the Covered Software is governed by the terms of this
      License, and how they can obtain a copy of this License. You may not
      attempt to alter or restrict the recipients&#39; rights in the Source Code
      Form.</p>
    <p class="${"my-4"}">3.2. Distribution of Executable Form</p>
    <p class="${"my-4"}">If You distribute Covered Software in Executable Form then:</p>
    <p class="${"my-4"}">(a) such Covered Software must also be made available in Source Code
      Form, as described in Section 3.1, and You must inform recipients of
      the Executable Form how they can obtain a copy of such Source Code
      Form by reasonable means in a timely manner, at a charge no more
      than the cost of distribution to the recipient; and</p>
    <p class="${"my-4"}">(b) You may distribute such Executable Form under the terms of this
      License, or sublicense it under different terms, provided that the
      license for the Executable Form does not attempt to limit or alter
      the recipients&#39; rights in the Source Code Form under this License.</p>
    <p class="${"my-4"}">3.3. Distribution of a Larger Work</p>
    <p class="${"my-4"}">You may create and distribute a Larger Work under terms of Your choice,
      provided that You also comply with the requirements of this License for
      the Covered Software. If the Larger Work is a combination of Covered
      Software with a work governed by one or more Secondary Licenses, and the
      Covered Software is not Incompatible With Secondary Licenses, this
      License permits You to additionally distribute such Covered Software
      under the terms of such Secondary License(s), so that the recipient of
      the Larger Work may, at their option, further distribute the Covered
      Software under the terms of either this License or such Secondary
      License(s).</p>
    <p class="${"my-4"}">3.4. Notices</p>
    <p class="${"my-4"}">You may not remove or alter the substance of any license notices
      (including copyright notices, patent notices, disclaimers of warranty,
      or limitations of liability) contained within the Source Code Form of
      the Covered Software, except that You may alter any license notices to
      the extent required to remedy known factual inaccuracies.</p>
    <p class="${"my-4"}">3.5. Application of Additional Terms</p>
    <p class="${"my-4"}">You may choose to offer, and to charge a fee for, warranty, support,
      indemnity or liability obligations to one or more recipients of Covered
      Software. However, You may do so only on Your own behalf, and not on
      behalf of any Contributor. You must make it absolutely clear that any
      such warranty, support, indemnity, or liability obligation is offered by
      You alone, and You hereby agree to indemnify every Contributor for any
      liability incurred by such Contributor as a result of warranty, support,
      indemnity or liability terms You offer. You may include additional
      disclaimers of warranty and limitations of liability specific to any
      jurisdiction.</p>
    <h2 id="${"4-inability-to-comply-due-to-statute-or-regulation"}">4. Inability to Comply Due to Statute or Regulation</h2>
    <p class="${"my-4"}">If it is impossible for You to comply with any of the terms of this
      License with respect to some or all of the Covered Software due to
      statute, judicial order, or regulation then You must: (a) comply with
      the terms of this License to the maximum extent possible; and (b)
      describe the limitations and the code they affect. Such description must
      be placed in a text file included with all distributions of the Covered
      Software under this License. Except to the extent prohibited by statute
      or regulation, such description must be sufficiently detailed for a
      recipient of ordinary skill to be able to understand it.</p>
    <h2 id="${"5-termination"}">5. Termination</h2>
    <p class="${"my-4"}">5.1. The rights granted under this License will terminate automatically
      if You fail to comply with any of its terms. However, if You become
      compliant, then the rights granted under this License from a particular
      Contributor are reinstated (a) provisionally, unless and until such
      Contributor explicitly and finally terminates Your grants, and (b) on an
      ongoing basis, if such Contributor fails to notify You of the
      non-compliance by some reasonable means prior to 60 days after You have
      come back into compliance. Moreover, Your grants from a particular
      Contributor are reinstated on an ongoing basis if such Contributor
      notifies You of the non-compliance by some reasonable means, this is the
      first time You have received notice of non-compliance with this License
      from such Contributor, and You become compliant prior to 30 days after
      Your receipt of the notice.</p>
    <p class="${"my-4"}">5.2. If You initiate litigation against any entity by asserting a patent
      infringement claim (excluding declaratory judgment actions,
      counter-claims, and cross-claims) alleging that a Contributor Version
      directly or indirectly infringes any patent, then the rights granted to
      You by any and all Contributors for the Covered Software under Section
      2.1 of this License shall terminate.</p>
    <p class="${"my-4"}">5.3. In the event of termination under Sections 5.1 or 5.2 above, all
      end user license agreements (excluding distributors and resellers) which
      have been validly granted by You or Your distributors under this License
      prior to termination shall survive termination.</p>
    <hr>
    <ul><li>*</li>
      <li><ol><li>Disclaimer of Warranty *</li></ol></li></ul>
    <hr>
    <ul><li>*</li>
      <li>Covered Software is provided under this License on an &quot;as is&quot; *</li>
      <li>basis, without warranty of any kind, either expressed, implied, or *</li>
      <li>statutory, including, without limitation, warranties that the *</li>
      <li>Covered Software is free of defects, merchantable, fit for a *</li>
      <li>particular purpose or non-infringing. The entire risk as to the *</li>
      <li>quality and performance of the Covered Software is with You. *</li>
      <li>Should any Covered Software prove defective in any respect, You *</li>
      <li>(not any Contributor) assume the cost of any necessary servicing, *</li>
      <li>repair, or correction. This disclaimer of warranty constitutes an *</li>
      <li>essential part of this License. No use of any Covered Software is *</li>
      <li>authorized under this License except under this disclaimer. *</li>
      <li>*</li></ul>
    <hr>
    <hr>
    <ul><li>*</li>
      <li><ol><li>Limitation of Liability *</li></ol></li></ul>
    <hr>
    <ul><li>*</li>
      <li>Under no circumstances and under no legal theory, whether tort *</li>
      <li>(including negligence), contract, or otherwise, shall any *</li>
      <li>Contributor, or anyone who distributes Covered Software as *</li>
      <li>permitted above, be liable to You for any direct, indirect, *</li>
      <li>special, incidental, or consequential damages of any character *</li>
      <li>including, without limitation, damages for lost profits, loss of *</li>
      <li>goodwill, work stoppage, computer failure or malfunction, or any *</li>
      <li>and all other commercial damages or losses, even if such party *</li>
      <li>shall have been informed of the possibility of such damages. This *</li>
      <li>limitation of liability shall not apply to liability for death or *</li>
      <li>personal injury resulting from such party&#39;s negligence to the *</li>
      <li>extent applicable law prohibits such limitation. Some *</li>
      <li>jurisdictions do not allow the exclusion or limitation of *</li>
      <li>incidental or consequential damages, so this exclusion and *</li>
      <li>limitation may not apply to You. *</li>
      <li>*</li></ul>
    <hr>
    <h2 id="${"8-litigation"}">8. Litigation</h2>
    <p class="${"my-4"}">Any litigation relating to this License may be brought only in the
      courts of a jurisdiction where the defendant maintains its principal
      place of business and such litigation shall be governed by laws of that
      jurisdiction, without reference to its conflict-of-law provisions.
      Nothing in this Section shall prevent a party&#39;s ability to bring
      cross-claims or counter-claims.</p>
    <h2 id="${"9-miscellaneous"}">9. Miscellaneous</h2>
    <p class="${"my-4"}">This License represents the complete agreement concerning the subject
      matter hereof. If any provision of this License is held to be
      unenforceable, such provision shall be reformed only to the extent
      necessary to make it enforceable. Any law or regulation which provides
      that the language of a contract shall be construed against the drafter
      shall not be used to construe this License against a Contributor.</p>
    <h2 id="${"10-versions-of-the-license"}">10. Versions of the License</h2>
    <p class="${"my-4"}">10.1. New Versions</p>
    <p class="${"my-4"}">Mozilla Foundation is the license steward. Except as provided in Section
      10.3, no one other than the license steward has the right to modify or
      publish new versions of this License. Each version will be given a
      distinguishing version number.</p>
    <p class="${"my-4"}">10.2. Effect of New Versions</p>
    <p class="${"my-4"}">You may distribute the Covered Software under the terms of the version
      of the License under which You originally received the Covered Software,
      or under the terms of any subsequent version published by the license
      steward.</p>
    <p class="${"my-4"}">10.3. Modified Versions</p>
    <p class="${"my-4"}">If you create software not governed by this License, and you want to
      create a new license for such software, you may create and use a
      modified version of this License if you rename the license and remove
      any references to the name of the license steward (except to note that
      such modified license differs from this License).</p>
    <p class="${"my-4"}">10.4. Distributing Source Code Form that is Incompatible With Secondary
      Licenses</p>
    <p class="${"my-4"}">If You choose to distribute Source Code Form that is Incompatible With
      Secondary Licenses under the terms of this version of the License, the
      notice described in Exhibit B of this License must be attached.</p>
    <h2 id="${"exhibit-a-source-code-form-license-notice"}">Exhibit A - Source Code Form License Notice</h2>
    <p class="${"my-4"}">This Source Code Form is subject to the terms of the Mozilla Public
      License, v. 2.0. If a copy of the MPL was not distributed with this
      file, You can obtain one at <a href="${"http://mozilla.org/MPL/2.0/"}">http://mozilla.org/MPL/2.0/</a>.</p>
    <p class="${"my-4"}">If it is not possible or desirable to put the notice in a particular
      file, then You may include the notice in a location (such as a LICENSE
      file in a relevant directory) where a recipient would be likely to look
      for such a notice.</p>
    <p class="${"my-4"}">You may add additional accurate notices of copyright ownership.</p>
    <h2 id="${"exhibit-b-incompatible-with-secondary-licenses-notice"}">Exhibit B - &quot;Incompatible With Secondary
      Licenses&quot; Notice</h2>
    <p class="${"my-4"}">This Source Code Form is &quot;Incompatible With Secondary Licenses&quot;, as
      defined by the Mozilla Public License, v. 2.0.</p></div>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/3.js
var __exports4 = {};
__export(__exports4, {
  css: () => css5,
  entry: () => entry4,
  index: () => index4,
  js: () => js4,
  module: () => license_svelte_exports
});
var index4, entry4, js4, css5;
var init__4 = __esm({
  ".svelte-kit/output/server/nodes/3.js"() {
    init_shims();
    init_license_svelte();
    index4 = 3;
    entry4 = "pages/license.svelte-3a824568.js";
    js4 = ["pages/license.svelte-3a824568.js", "chunks/index-ceb1e3f7.js", "chunks/page-78720293.js", "chunks/preload-helper-60cab3ee.js", "chunks/github_button-efffc229.js"];
    css5 = ["assets/page-c43c69cf.css"];
  }
});

// .svelte-kit/output/server/entries/pages/privacy.svelte.js
var privacy_svelte_exports = {};
__export(privacy_svelte_exports, {
  default: () => Privacy
});
var import_lodash4, Privacy;
var init_privacy_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/privacy.svelte.js"() {
    init_shims();
    init_index_43ce8bc5();
    init_page_610407ff();
    import_lodash4 = __toESM(require_lodash(), 1);
    init_svelte_copy();
    Privacy = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Page, "Page").$$render($$result, { home: "false" }, {}, {
        default: () => {
          return `<div class="${"mx-auto my-20 max-w-5xl mt-24 font-baloo2 px-20"}"><h1 class="${"font-vollkorn text-3xl"}"><strong>Privacy Policy</strong></h1>
    <br>

    <p>Neil Agrawal built the PeaceBox app as
      a Free app. This SERVICE is provided by
      Neil Agrawal at no cost and is intended for use as
      is.
    </p>
    <br>
    <p>This page is used to inform visitors regarding my
      policies with the collection, use, and disclosure of Personal
      Information if anyone decided to use my Service.
    </p>
    <br>
    <p>If you choose to use my Service, then you agree to
      the collection and use of information in relation to this
      policy. The Personal Information that I collect is
      used for providing and improving the Service. I will not use or share your information with
      anyone except as described in this Privacy Policy.
    </p>
    <br>
    <p>The terms used in this Privacy Policy have the same meanings
      as in our Terms and Conditions, which is accessible at
      PeaceBox unless otherwise defined in this Privacy Policy.
    </p>
    <br>
    <br>
    <p style="${"font-family: 'vollkorn', Helvetica, Arial, sans-serif"}"><strong>Information Collection and Use</strong></p>
    <br>
    <p>For a better experience, while using our Service, I
      may require you to provide us with certain personally
      identifiable information. The information that
      I request will be retained on your device and is not collected by me in any way.
    </p>
    <br>
    <div><p>The app does use third party services that may collect
      information used to identify you.
    </p>
      <br>
      <p>Link to privacy policy of third party service providers used
        by the app
      </p>
      <br>
      <ul>
        <li><a href="${"https://firebase.google.com/policies/analytics"}" target="${"_blank"}" rel="${"noopener noreferrer"}"><strong>Google
          Analytics for Firebase</strong></a></li>
        <br>
        <li><a href="${"https://firebase.google.com/support/privacy/"}" target="${"_blank"}" rel="${"noopener noreferrer"}"><strong>Firebase
          Crashlytics</strong></a></li>
        
        </ul></div>
    <br>
    <br>
    <p class="${"font-vollkorn text-2xl"}"><strong>Log Data</strong></p>
    <br>
    <p>I want to inform you that whenever you
      use my Service, in a case of an error in the app
      I collect data and information (through third party
      products) on your phone called Log Data. This Log Data may
      include information such as your device Internet Protocol
      (\u201CIP\u201D) address, device name, operating system version, the
      configuration of the app when utilizing my Service,
      the time and date of your use of the Service, and other
      statistics.
    </p>
    <br><br>
    <p class="${"font-vollkorn text-2xl"}"><strong>Cookies</strong></p>
    <br>
    <p>Cookies are files with a small amount of data that are
      commonly used as anonymous unique identifiers. These are sent
      to your browser from the websites that you visit and are
      stored on your device&#39;s internal memory.
    </p>
    <p>This Service does not use these \u201Ccookies\u201D explicitly. However,
      the app may use third party code and libraries that use
      \u201Ccookies\u201D to collect information and improve their services.
      You have the option to either accept or refuse these cookies
      and know when a cookie is being sent to your device. If you
      choose to refuse our cookies, you may not be able to use some
      portions of this Service.
    </p>
    <br><br>
    <p class="${"font-vollkorn text-2xl"}"><strong>Service Providers</strong></p>
    <br>
    <p>I may employ third-party companies and
      individuals due to the following reasons:
    </p>
    <br>
    <ul><li>To facilitate our Service;</li>
      <li>To provide the Service on our behalf;</li>
      <li>To perform Service-related services; or</li>
      <li>To assist us in analyzing how our Service is used.</li></ul>
    <br>
    <p>I want to inform users of this Service
      that these third parties have access to your Personal
      Information. The reason is to perform the tasks assigned to
      them on our behalf. However, they are obligated not to
      disclose or use the information for any other purpose.
    </p>
    <p class="${"font-vollkorn text-2xl"}"><strong>Security</strong></p>
    <br>
    <p>I value your trust in providing us your
      Personal Information, thus we are striving to use commercially
      acceptable means of protecting it. But remember that no method
      of transmission over the internet, or method of electronic
      storage is 100% secure and reliable, and I cannot
      guarantee its absolute security.
    </p>
    <br><br>
    <p class="${"font-vollkorn text-2xl"}"><strong>Links to Other Sites</strong></p>
    <br>
    <p>This Service may contain links to other sites. If you click on
      a third-party link, you will be directed to that site. Note
      that these external sites are not operated by me.
      Therefore, I strongly advise you to review the
      Privacy Policy of these websites. I have
      no control over and assume no responsibility for the content,
      privacy policies, or practices of any third-party sites or
      services.
    </p>
    <br><br>
    <p class="${"font-vollkorn text-2xl"}"><strong>Children\u2019s Privacy</strong></p>
    <br>
    <p>These Services do not address anyone under the age of 13.
      I do not knowingly collect personally
      identifiable information from children under 13 years of age. In the case
      I discover that a child under 13 has provided
      me with personal information, I immediately
      delete this from our servers. If you are a parent or guardian
      and you are aware that your child has provided us with
      personal information, please contact me so that
      I will be able to do necessary actions.
    </p>
    <br><br>
    <p class="${"font-vollkorn text-2xl"}"><strong>Changes to This Privacy Policy</strong></p>
    <br>
    <p>I may update our Privacy Policy from
      time to time. Thus, you are advised to review this page
      periodically for any changes. I will
      notify you of any changes by posting the new Privacy Policy on
      this page.
    </p>
    <br>
    <p>This policy is effective as of 2021-10-29</p>
    <br>
    <p class="${"font-vollkorn text-2xl"}"><strong>Contact Us</strong></p>
    <p>If you have any questions or suggestions about my
      Privacy Policy, do not hesitate to contact me at contact@peacebox.app.
    </p></div>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/4.js
var __exports5 = {};
__export(__exports5, {
  css: () => css6,
  entry: () => entry5,
  index: () => index5,
  js: () => js5,
  module: () => privacy_svelte_exports
});
var index5, entry5, js5, css6;
var init__5 = __esm({
  ".svelte-kit/output/server/nodes/4.js"() {
    init_shims();
    init_privacy_svelte();
    index5 = 4;
    entry5 = "pages/privacy.svelte-7c7cf34e.js";
    js5 = ["pages/privacy.svelte-7c7cf34e.js", "chunks/index-ceb1e3f7.js", "chunks/page-78720293.js", "chunks/preload-helper-60cab3ee.js"];
    css6 = ["assets/page-c43c69cf.css"];
  }
});

// .svelte-kit/output/server/entries/pages/terms.svelte.js
var terms_svelte_exports = {};
__export(terms_svelte_exports, {
  default: () => Terms
});
var import_lodash5, Terms;
var init_terms_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/terms.svelte.js"() {
    init_shims();
    init_index_43ce8bc5();
    init_page_610407ff();
    import_lodash5 = __toESM(require_lodash(), 1);
    init_svelte_copy();
    Terms = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${validate_component(Page, "Page").$$render($$result, { home: "false" }, {}, {
        default: () => {
          return `<div class="${"mx-auto my-20 max-w-5xl mt-24 font-baloo2 px-20"}"><h1 class="${"font-vollkorn text-3xl"}"><strong>Terms &amp; Conditions</strong></h1>
    <br>
    <p>By downloading or using the app, these terms will
      automatically apply to you \u2013 you should make sure therefore
      that you read them carefully before using the app. You\u2019re not
      allowed to copy, or modify the app, any part of the app, or
      our trademarks in any way. You\u2019re not allowed to attempt to
      extract the source code of the app, and you also shouldn\u2019t try
      to translate the app into other languages, or make derivative
      versions. The app itself, and all the trade marks, copyright,
      database rights and other intellectual property rights related
      to it, still belong to Neil Agrawal.
    </p>
    <br>
    <p>Neil Agrawal is committed to ensuring that the app is
      as useful and efficient as possible. For that reason, we
      reserve the right to make changes to the app or to charge for
      its services, at any time and for any reason. We will never
      charge you for the app or its services without making it very
      clear to you exactly what you\u2019re paying for.
    </p>
    <br>
    <p>The PeaceBox app stores and processes personal data that
      you have provided to us, in order to provide my
      Service. It\u2019s your responsibility to keep your phone and
      access to the app secure. We therefore recommend that you do
      not jailbreak or root your phone, which is the process of
      removing software restrictions and limitations imposed by the
      official operating system of your device. It could make your
      phone vulnerable to malware/viruses/malicious programs,
      compromise your phone\u2019s security features and it could mean
      that the PeaceBox app won\u2019t work properly or at all.
    </p>
    <br>
    <div><p>The app does use third party services that declare their own
      Terms and Conditions.
    </p>
      <br>
      <p>Link to Terms and Conditions of third party service
        providers used by the app
      </p>
      <ul>
        <br>
        <li><a href="${"https://firebase.google.com/terms/analytics"}" target="${"_blank"}" rel="${"noopener noreferrer"}">Google
          Analytics for Firebase</a></li>
        <br>
        <li><a href="${"https://firebase.google.com/terms/crashlytics"}" target="${"_blank"}" rel="${"noopener noreferrer"}">Firebase
          Crashlytics</a></li>
        </ul>
      <br></div>
    <p>You should be aware that there are certain things that
      Neil Agrawal will not take responsibility for. Certain
      functions of the app will require the app to have an active
      internet connection. The connection can be Wi-Fi, or provided
      by your mobile network provider, but Neil Agrawal
      cannot take responsibility for the app not working at full
      functionality if you don\u2019t have access to Wi-Fi, and you don\u2019t
      have any of your data allowance left.
    </p>
    <br>
    <p></p>
    <br>
    <p>If you\u2019re using the app outside of an area with Wi-Fi, you
      should remember that your terms of the agreement with your
      mobile network provider will still apply. As a result, you may
      be charged by your mobile provider for the cost of data for
      the duration of the connection while accessing the app, or
      other third party charges. In using the app, you\u2019re accepting
      responsibility for any such charges, including roaming data
      charges if you use the app outside of your home territory
      (i.e. region or country) without turning off data roaming. If
      you are not the bill payer for the device on which you\u2019re
      using the app, please be aware that we assume that you have
      received permission from the bill payer for using the app.
    </p>
    <br>
    <p>Along the same lines, Neil Agrawal cannot always take
      responsibility for the way you use the app i.e. You need to
      make sure that your device stays charged \u2013 if it runs out of
      battery and you can\u2019t turn it on to avail the Service,
      Neil Agrawal cannot accept responsibility.
    </p>
    <br>
    <p>With respect to Neil Agrawal\u2019s responsibility for your
      use of the app, when you\u2019re using the app, it\u2019s important to
      bear in mind that although we endeavour to ensure that it is
      updated and correct at all times, we do rely on third parties
      to provide information to us so that we can make it available
      to you. Neil Agrawal accepts no liability for any
      loss, direct or indirect, you experience as a result of
      relying wholly on this functionality of the app.
    </p>
    <br>
    <p>At some point, we may wish to update the app. The app is
      currently available on iOS \u2013 the requirements for
      system(and for any additional systems we
      decide to extend the availability of the app to) may change,
      and you\u2019ll need to download the updates if you want to keep
      using the app. Neil Agrawal does not promise that it
      will always update the app so that it is relevant to you
      and/or works with the iOS version that you have
      installed on your device. However, you promise to always
      accept updates to the application when offered to you, We may
      also wish to stop providing the app, and may terminate use of
      it at any time without giving notice of termination to you.
      Unless we tell you otherwise, upon any termination, (a) the
      rights and licenses granted to you in these terms will end;
      (b) you must stop using the app, and (if needed) delete it
      from your device.
    </p>
    <br>
    <p class="${"font-vollkorn text-2xl"}"><strong>Changes to This Terms and Conditions</strong></p><br>

    <p>I may update our Terms and Conditions
      from time to time. Thus, you are advised to review this page
      periodically for any changes. I will
      notify you of any changes by posting the new Terms and
      Conditions on this page.
    </p>
    <br>
    <p>These terms and conditions are effective as of 2021-10-29
    </p>
    <br>
    <p class="${"font-vollkorn text-2xl"}"><strong>Contact Us</strong></p>
    <br>
    <p>If you have any questions or suggestions about my
      Terms and Conditions, do not hesitate to contact me
      at contact@peacebox.app.
    </p></div>`;
        }
      })}`;
    });
  }
});

// .svelte-kit/output/server/nodes/5.js
var __exports6 = {};
__export(__exports6, {
  css: () => css7,
  entry: () => entry6,
  index: () => index6,
  js: () => js6,
  module: () => terms_svelte_exports
});
var index6, entry6, js6, css7;
var init__6 = __esm({
  ".svelte-kit/output/server/nodes/5.js"() {
    init_shims();
    init_terms_svelte();
    index6 = 5;
    entry6 = "pages/terms.svelte-a28071c2.js";
    js6 = ["pages/terms.svelte-a28071c2.js", "chunks/index-ceb1e3f7.js", "chunks/page-78720293.js", "chunks/preload-helper-60cab3ee.js"];
    css7 = ["assets/page-c43c69cf.css"];
  }
});

// .svelte-kit/.svelte-kit/entry.js
var entry_exports = {};
__export(entry_exports, {
  default: () => svelteKit
});
module.exports = __toCommonJS(entry_exports);
init_shims();

// .svelte-kit/output/server/index.js
init_shims();
init_index_43ce8bc5();

function afterUpdate() {
}

var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  {
    stores.page.set(page);
  }
  return `


${components[1] ? `${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => {
      return `${components[2] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
        default: () => {
          return `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}`;
        }
      })}` : `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {})}`}`;
    }
  })}` : `${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {})}`}

${``}`;
});
function to_headers(object) {
  const headers = new Headers();
  if (object) {
    for (const key2 in object) {
      const value = object[key2];
      if (!value)
        continue;
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          headers.append(key2, value2);
        });
      } else {
        headers.set(key2, value);
      }
    }
  }
  return headers;
}
function hash(value) {
  let hash2 = 5381;
  let i2 = value.length;
  if (typeof value === "string") {
    while (i2)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i2);
  } else {
    while (i2)
      hash2 = hash2 * 33 ^ value[--i2];
  }
  return (hash2 >>> 0).toString(36);
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key2 in obj) {
    clone2[key2.toLowerCase()] = obj[key2];
  }
  return clone2;
}
function decode_params(params) {
  for (const key2 in params) {
    params[key2] = params[key2].replace(/%23/g, "#").replace(/%3[Bb]/g, ";").replace(/%2[Cc]/g, ",").replace(/%2[Ff]/g, "/").replace(/%3[Ff]/g, "?").replace(/%3[Aa]/g, ":").replace(/%40/g, "@").replace(/%26/g, "&").replace(/%3[Dd]/g, "=").replace(/%2[Bb]/g, "+").replace(/%24/g, "$");
  }
  return params;
}
function is_pojo(body) {
  if (typeof body !== "object")
    return false;
  if (body) {
    if (body instanceof Uint8Array)
      return false;
    if (body._readableState && typeof body.pipe === "function")
      return false;
    if (typeof ReadableStream !== "undefined" && body instanceof ReadableStream)
      return false;
  }
  return true;
}
function normalize_request_method(event) {
  const method = event.request.method.toLowerCase();
  return method === "delete" ? "del" : method;
}
function error(body) {
  return new Response(body, {
    status: 500
  });
}
function is_string(s22) {
  return typeof s22 === "string" || s22 instanceof String;
}
var text_types = /* @__PURE__ */ new Set([
  "application/xml",
  "application/json",
  "application/x-www-form-urlencoded",
  "multipart/form-data"
]);
function is_text(content_type) {
  if (!content_type)
    return true;
  const type = content_type.split(";")[0].toLowerCase();
  return type.startsWith("text/") || type.endsWith("+xml") || text_types.has(type);
}
async function render_endpoint(event, mod) {
  const method = normalize_request_method(event);
  let handler = mod[method];
  if (!handler && method === "head") {
    handler = mod.get;
  }
  if (!handler) {
    const allowed = [];
    for (const method2 in ["get", "post", "put", "patch"]) {
      if (mod[method2])
        allowed.push(method2.toUpperCase());
    }
    if (mod.del)
      allowed.push("DELETE");
    if (mod.get || mod.head)
      allowed.push("HEAD");
    return event.request.headers.get("x-sveltekit-load") ? new Response(void 0, {
      status: 204
    }) : new Response(`${event.request.method} method not allowed`, {
      status: 405,
      headers: {
        allow: allowed.join(", ")
      }
    });
  }
  const response = await handler(event);
  const preface = `Invalid response from route ${event.url.pathname}`;
  if (typeof response !== "object") {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  if (response.fallthrough) {
    throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
  }
  const { status = 200, body = {} } = response;
  const headers = response.headers instanceof Headers ? new Headers(response.headers) : to_headers(response.headers);
  const type = headers.get("content-type");
  if (!is_text(type) && !(body instanceof Uint8Array || is_string(body))) {
    return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if (is_pojo(body) && (!type || type.startsWith("application/json"))) {
    headers.set("content-type", "application/json; charset=utf-8");
    normalized_body = JSON.stringify(body);
  } else {
    normalized_body = body;
  }
  if ((typeof normalized_body === "string" || normalized_body instanceof Uint8Array) && !headers.has("etag")) {
    const cache_control = headers.get("cache-control");
    if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
      headers.set("etag", `"${hash(normalized_body)}"`);
    }
  }
  return new Response(method !== "head" ? normalized_body : void 0, {
    status,
    headers
  });
}

var chars$1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = /* @__PURE__ */ new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key2) {
            return walk(thing[key2]);
          });
      }
    }
  }

  walk(value);
  var names = /* @__PURE__ */ new Map();
  Array.from(counts).filter(function(entry7) {
    return entry7[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry7, i2) {
    names.set(entry7[0], getName(i2));
  });

  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ", \"" + thing.flags + "\")";
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i2) {
          return i2 in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key2) {
          return safeKey(key2) + ":" + stringify(thing[key2]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i2) {
            statements_1.push(name + "[" + i2 + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key2) {
            statements_1.push("" + name + safeProp(key2) + "=" + stringify(thing[key2]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars$1[num % chars$1.length] + name;
    num = ~~(num / chars$1.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped2[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? key2 : escapeUnsafeChars(JSON.stringify(key2));
}
function safeProp(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? "." + key2 : "[" + escapeUnsafeChars(JSON.stringify(key2)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i2 = 0; i2 < str.length; i2 += 1) {
    var char = str.charAt(i2);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped2) {
      result += escaped2[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i2 + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i2];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += "\"";
  return result;
}

function noop3() {
}

function safe_not_equal2(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue = [];

function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}

function writable(value, start = noop3) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();

  function set(new_value) {
    if (safe_not_equal2(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i2 = 0; i2 < subscriber_queue.length; i2 += 2) {
            subscriber_queue[i2][0](subscriber_queue[i2 + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }

  function update(fn) {
    set(fn(value));
  }

  function subscribe(run2, invalidate = noop3) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop3;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }

  return { set, update, subscribe };
}
function coalesce_to_error(err) {
  return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}

var render_json_payload_script_dict = {
  "<": "\\u003C",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var render_json_payload_script_regex = new RegExp(`[${Object.keys(render_json_payload_script_dict).join("")}]`, "g");
function render_json_payload_script(attrs, payload) {
  const safe_payload = JSON.stringify(payload).replace(render_json_payload_script_regex, (match) => render_json_payload_script_dict[match]);
  let safe_attrs = "";
  for (const [key2, value] of Object.entries(attrs)) {
    if (value === void 0)
      continue;
    safe_attrs += ` sveltekit:data-${key2}=${escape_html_attr(value)}`;
  }
  return `<script type="application/json"${safe_attrs}>${safe_payload}<\/script>`;
}

var escape_html_attr_dict = {
  "&": "&amp;",
  "\"": "&quot;"
};
var escape_html_attr_regex = new RegExp(`[${Object.keys(escape_html_attr_dict).join("")}]|[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]`, "g");
function escape_html_attr(str) {
  const escaped_str = str.replace(escape_html_attr_regex, (match) => {
    if (match.length === 2) {
      return match;
    }
    return escape_html_attr_dict[match] ?? `&#${match.charCodeAt(0)};`;
  });
  return `"${escaped_str}"`;
}
var s2 = JSON.stringify;
var encoder = new TextEncoder();
function sha256(data) {
  if (!key[0])
    precompute();
  const out = init.slice(0);
  const array2 = encode$1(data);
  for (let i2 = 0; i2 < array2.length; i2 += 16) {
    const w = array2.subarray(i2, i2 + 16);
    let tmp;
    let a;
    let b;
    let out0 = out[0];
    let out1 = out[1];
    let out2 = out[2];
    let out3 = out[3];
    let out4 = out[4];
    let out5 = out[5];
    let out6 = out[6];
    let out7 = out[7];
    for (let i22 = 0; i22 < 64; i22++) {
      if (i22 < 16) {
        tmp = w[i22];
      } else {
        a = w[i22 + 1 & 15];
        b = w[i22 + 14 & 15];
        tmp = w[i22 & 15] = (a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i22 & 15] + w[i22 + 9 & 15] | 0;
      }
      tmp = tmp + out7 + (out4 >>> 6 ^ out4 >>> 11 ^ out4 >>> 25 ^ out4 << 26 ^ out4 << 21 ^ out4 << 7) + (out6 ^ out4 & (out5 ^ out6)) + key[i22];
      out7 = out6;
      out6 = out5;
      out5 = out4;
      out4 = out3 + tmp | 0;
      out3 = out2;
      out2 = out1;
      out1 = out0;
      out0 = tmp + (out1 & out2 ^ out3 & (out1 ^ out2)) + (out1 >>> 2 ^ out1 >>> 13 ^ out1 >>> 22 ^ out1 << 30 ^ out1 << 19 ^ out1 << 10) | 0;
    }
    out[0] = out[0] + out0 | 0;
    out[1] = out[1] + out1 | 0;
    out[2] = out[2] + out2 | 0;
    out[3] = out[3] + out3 | 0;
    out[4] = out[4] + out4 | 0;
    out[5] = out[5] + out5 | 0;
    out[6] = out[6] + out6 | 0;
    out[7] = out[7] + out7 | 0;
  }
  const bytes = new Uint8Array(out.buffer);
  reverse_endianness(bytes);
  return base64(bytes);
}
var init = new Uint32Array(8);
var key = new Uint32Array(64);
function precompute() {
  function frac(x2) {
    return (x2 - Math.floor(x2)) * 4294967296;
  }
  let prime = 2;
  for (let i2 = 0; i2 < 64; prime++) {
    let is_prime = true;
    for (let factor = 2; factor * factor <= prime; factor++) {
      if (prime % factor === 0) {
        is_prime = false;
        break;
      }
    }
    if (is_prime) {
      if (i2 < 8) {
        init[i2] = frac(prime ** (1 / 2));
      }
      key[i2] = frac(prime ** (1 / 3));
      i2++;
    }
  }
}
function reverse_endianness(bytes) {
  for (let i2 = 0; i2 < bytes.length; i2 += 4) {
    const a = bytes[i2 + 0];
    const b = bytes[i2 + 1];
    const c = bytes[i2 + 2];
    const d = bytes[i2 + 3];
    bytes[i2 + 0] = d;
    bytes[i2 + 1] = c;
    bytes[i2 + 2] = b;
    bytes[i2 + 3] = a;
  }
}
function encode$1(str) {
  const encoded = encoder.encode(str);
  const length = encoded.length * 8;
  const size = 512 * Math.ceil((length + 65) / 512);
  const bytes = new Uint8Array(size / 8);
  bytes.set(encoded);
  bytes[encoded.length] = 128;
  reverse_endianness(bytes);
  const words = new Uint32Array(bytes.buffer);
  words[words.length - 2] = Math.floor(length / 4294967296);
  words[words.length - 1] = length;
  return words;
}

var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
function base64(bytes) {
  const l = bytes.length;
  let result = "";
  let i2;
  for (i2 = 2; i2 < l; i2 += 3) {
    result += chars[bytes[i2 - 2] >> 2];
    result += chars[(bytes[i2 - 2] & 3) << 4 | bytes[i2 - 1] >> 4];
    result += chars[(bytes[i2 - 1] & 15) << 2 | bytes[i2] >> 6];
    result += chars[bytes[i2] & 63];
  }
  if (i2 === l + 1) {
    result += chars[bytes[i2 - 2] >> 2];
    result += chars[(bytes[i2 - 2] & 3) << 4];
    result += "==";
  }
  if (i2 === l) {
    result += chars[bytes[i2 - 2] >> 2];
    result += chars[(bytes[i2 - 2] & 3) << 4 | bytes[i2 - 1] >> 4];
    result += chars[(bytes[i2 - 1] & 15) << 2];
    result += "=";
  }
  return result;
}
var csp_ready;
var array = new Uint8Array(16);
function generate_nonce() {
  crypto.getRandomValues(array);
  return base64(array);
}
var quoted = /* @__PURE__ */ new Set([
  "self",
  "unsafe-eval",
  "unsafe-hashes",
  "unsafe-inline",
  "none",
  "strict-dynamic",
  "report-sample"
]);
var crypto_pattern = /^(nonce|sha\d\d\d)-/;
var Csp = class {
  #use_hashes;
  #dev;
  #script_needs_csp;
  #style_needs_csp;
  #directives;
  #script_src;
  #style_src;

  constructor({ mode, directives }, { dev, prerender, needs_nonce }) {
    this.#use_hashes = mode === "hash" || mode === "auto" && prerender;
    this.#directives = dev ? { ...directives } : directives;
    this.#dev = dev;
    const d = this.#directives;
    if (dev) {
      const effective_style_src2 = d["style-src"] || d["default-src"];
      if (effective_style_src2 && !effective_style_src2.includes("unsafe-inline")) {
        d["style-src"] = [...effective_style_src2, "unsafe-inline"];
      }
    }
    this.#script_src = [];
    this.#style_src = [];
    const effective_script_src = d["script-src"] || d["default-src"];
    const effective_style_src = d["style-src"] || d["default-src"];
    this.#script_needs_csp = !!effective_script_src && effective_script_src.filter((value) => value !== "unsafe-inline").length > 0;
    this.#style_needs_csp = !dev && !!effective_style_src && effective_style_src.filter((value) => value !== "unsafe-inline").length > 0;
    this.script_needs_nonce = this.#script_needs_csp && !this.#use_hashes;
    this.style_needs_nonce = this.#style_needs_csp && !this.#use_hashes;
    if (this.script_needs_nonce || this.style_needs_nonce || needs_nonce) {
      this.nonce = generate_nonce();
    }
  }
  add_script(content) {
    if (this.#script_needs_csp) {
      if (this.#use_hashes) {
        this.#script_src.push(`sha256-${sha256(content)}`);
      } else if (this.#script_src.length === 0) {
        this.#script_src.push(`nonce-${this.nonce}`);
      }
    }
  }
  add_style(content) {
    if (this.#style_needs_csp) {
      if (this.#use_hashes) {
        this.#style_src.push(`sha256-${sha256(content)}`);
      } else if (this.#style_src.length === 0) {
        this.#style_src.push(`nonce-${this.nonce}`);
      }
    }
  }
  get_header(is_meta = false) {
    const header = [];
    const directives = { ...this.#directives };
    if (this.#style_src.length > 0) {
      directives["style-src"] = [
        ...directives["style-src"] || directives["default-src"] || [],
        ...this.#style_src
      ];
    }
    if (this.#script_src.length > 0) {
      directives["script-src"] = [
        ...directives["script-src"] || directives["default-src"] || [],
        ...this.#script_src
      ];
    }
    for (const key2 in directives) {
      if (is_meta && (key2 === "frame-ancestors" || key2 === "report-uri" || key2 === "sandbox")) {
        continue;
      }
      const value = directives[key2];
      if (!value)
        continue;
      const directive = [key2];
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          if (quoted.has(value2) || crypto_pattern.test(value2)) {
            directive.push(`'${value2}'`);
          } else {
            directive.push(value2);
          }
        });
      }
      header.push(directive.join(" "));
    }
    return header.join("; ");
  }
  get_meta() {
    const content = escape_html_attr(this.get_header(true));
    return `<meta http-equiv="content-security-policy" content=${content}>`;
  }
};
var absolute = /^([a-z]+:)?\/?\//;
var scheme = /^[a-z]+:/;
function resolve(base2, path) {
  if (scheme.test(path))
    return path;
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i2 = 0; i2 < pathparts.length; i2 += 1) {
    const part = pathparts[i2];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function is_root_relative(path) {
  return path[0] === "/" && path[1] !== "/";
}
function normalize_path(path, trailing_slash) {
  if (path === "/" || trailing_slash === "ignore")
    return path;
  if (trailing_slash === "never") {
    return path.endsWith("/") ? path.slice(0, -1) : path;
  } else if (trailing_slash === "always" && !path.endsWith("/")) {
    return path + "/";
  }
  return path;
}
var LoadURL = class extends URL {
  get hash() {
    throw new Error("url.hash is inaccessible from load. Consider accessing hash from the page store within the script tag of your component.");
  }
};
var PrerenderingURL = class extends URL {
  get search() {
    throw new Error("Cannot access url.search on a page with prerendering enabled");
  }
  get searchParams() {
    throw new Error("Cannot access url.searchParams on a page with prerendering enabled");
  }
};
var updated = {
  ...readable(false),
  check: () => false
};
async function render_response({
  branch,
  options,
  state,
  $session,
  page_config,
  status,
  error: error2 = null,
  event,
  resolve_opts,
                                 stuff
}) {
  if (state.prerendering) {
    if (options.csp.mode === "nonce") {
      throw new Error("Cannot use prerendering if config.kit.csp.mode === \"nonce\"");
    }
    if (options.template_contains_nonce) {
      throw new Error("Cannot use prerendering if page template contains %sveltekit.nonce%");
    }
  }
  const stylesheets = new Set(options.manifest._.entry.css);
  const modulepreloads = new Set(options.manifest._.entry.js);
  const styles = /* @__PURE__ */ new Map();
  const serialized_data = [];
  let shadow_props;
  let rendered;
  let is_private = false;
  let cache;
  if (error2) {
    error2.stack = options.get_stack(error2);
  }
  if (resolve_opts.ssr) {
    branch.forEach(({ node, props: props2, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => stylesheets.add(url));
      if (node.js)
        node.js.forEach((url) => modulepreloads.add(url));
      if (node.styles)
        Object.entries(node.styles).forEach(([k, v]) => styles.set(k, v));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (props2)
        shadow_props = props2;
      cache = loaded == null ? void 0 : loaded.cache;
      is_private = (cache == null ? void 0 : cache.private) ?? uses_credentials;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session: {
          ...session,
          subscribe: (fn) => {
            is_private = (cache == null ? void 0 : cache.private) ?? true;
            return session.subscribe(fn);
          }
        },
        updated
      },
      page: {
        error: error2,
        params: event.params,
        routeId: event.routeId,
        status,
        stuff,
        url: state.prerendering ? new PrerenderingURL(event.url) : event.url
      },
      components: branch.map(({ node }) => node.module.default)
    };
    const print_error = (property, replacement) => {
      Object.defineProperty(props.page, property, {
        get: () => {
          throw new Error(`$page.${property} has been replaced by $page.url.${replacement}`);
        }
      });
    };
    print_error("origin", "origin");
    print_error("path", "pathname");
    print_error("query", "searchParams");
    for (let i2 = 0; i2 < branch.length; i2 += 1) {
      props[`props_${i2}`] = await branch[i2].loaded.props;
    }
    rendered = options.root.render(props);
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  let { head, html: body } = rendered;
  const inlined_style = Array.from(styles.values()).join("\n");
  await csp_ready;
  const csp = new Csp(options.csp, {
    dev: options.dev,
    prerender: !!state.prerendering,
    needs_nonce: options.template_contains_nonce
  });
  const target = hash(body);
  const init_app = `
		import { start } from ${s2(options.prefix + options.manifest._.entry.file)};
		start({
			target: document.querySelector('[data-sveltekit-hydrate="${target}"]').parentNode,
			paths: ${s2(options.paths)},
			session: ${try_serialize($session, (error3) => {
    throw new Error(`Failed to serialize session data: ${error3.message}`);
  })},
			route: ${!!page_config.router},
			spa: ${!resolve_opts.ssr},
			trailing_slash: ${s2(options.trailing_slash)},
			hydrate: ${resolve_opts.ssr && page_config.hydrate ? `{
				status: ${status},
				error: ${serialize_error(error2)},
				nodes: [${branch.map(({ node }) => node.index).join(", ")}],
				params: ${devalue(event.params)},
				routeId: ${s2(event.routeId)}
			}` : "null"}
		});
	`;
  const init_service_worker = `
		if ('serviceWorker' in navigator) {
			addEventListener('load', () => {
				navigator.serviceWorker.register('${options.service_worker}');
			});
		}
	`;
  if (inlined_style) {
    const attributes = [];
    if (options.dev)
      attributes.push(" data-sveltekit");
    if (csp.style_needs_nonce)
      attributes.push(` nonce="${csp.nonce}"`);
    csp.add_style(inlined_style);
    head += `
	<style${attributes.join("")}>${inlined_style}</style>`;
  }
  head += Array.from(stylesheets).map((dep) => {
    const attributes = [
      "rel=\"stylesheet\"",
      `href="${options.prefix + dep}"`
    ];
    if (csp.style_needs_nonce) {
      attributes.push(`nonce="${csp.nonce}"`);
    }
    if (styles.has(dep)) {
      attributes.push("disabled", "media=\"(max-width: 0)\"");
    }
    return `
	<link ${attributes.join(" ")}>`;
  }).join("");
  if (page_config.router || page_config.hydrate) {
    head += Array.from(modulepreloads).map((dep) => `
	<link rel="modulepreload" href="${options.prefix + dep}">`).join("");
    const attributes = ["type=\"module\"", `data-sveltekit-hydrate="${target}"`];
    csp.add_script(init_app);
    if (csp.script_needs_nonce) {
      attributes.push(`nonce="${csp.nonce}"`);
    }
    body += `
		<script ${attributes.join(" ")}>${init_app}<\/script>`;
    body += serialized_data.map(({ url, body: body2, response }) => render_json_payload_script({
      type: "data",
      url,
      body: typeof body2 === "string" ? hash(body2) : void 0
    }, response)).join("\n	");
    if (shadow_props) {
      body += render_json_payload_script({ type: "props" }, shadow_props);
    }
  }
  if (options.service_worker) {
    csp.add_script(init_service_worker);
    head += `
			<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>${init_service_worker}<\/script>`;
  }
  if (state.prerendering) {
    const http_equiv = [];
    const csp_headers = csp.get_meta();
    if (csp_headers) {
      http_equiv.push(csp_headers);
    }
    if (cache) {
      http_equiv.push(`<meta http-equiv="cache-control" content="max-age=${cache.maxage}">`);
    }
    if (http_equiv.length > 0) {
      head = http_equiv.join("\n") + head;
    }
  }
  const segments = event.url.pathname.slice(options.paths.base.length).split("/").slice(2);
  const assets2 = options.paths.assets || (segments.length > 0 ? segments.map(() => "..").join("/") : ".");
  const html = await resolve_opts.transformPage({
    html: options.template({ head, body, assets: assets2, nonce: csp.nonce })
  });
  const headers = new Headers({
    "content-type": "text/html",
    etag: `"${hash(html)}"`
  });
  if (cache) {
    headers.set("cache-control", `${is_private ? "private" : "public"}, max-age=${cache.maxage}`);
  }
  if (!options.floc) {
    headers.set("permissions-policy", "interest-cohort=()");
  }
  if (!state.prerendering) {
    const csp_header = csp.get_header();
    if (csp_header) {
      headers.set("content-security-policy", csp_header);
    }
  }
  return new Response(html, {
    status,
    headers
  });
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(coalesce_to_error(err));
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize({ ...error2, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
var parse_1 = parse$1;
var serialize_1 = serialize;
var __toString = Object.prototype.toString;
var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
function parse$1(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  var obj = {};
  var opt = options || {};
  var dec = opt.decode || decode;
  var index7 = 0;
  while (index7 < str.length) {
    var eqIdx = str.indexOf("=", index7);
    if (eqIdx === -1) {
      break;
    }
    var endIdx = str.indexOf(";", index7);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index7 = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    var key2 = str.slice(index7, eqIdx).trim();
    if (obj[key2] === void 0) {
      var val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.charCodeAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key2] = tryDecode(val, dec);
    }
    index7 = endIdx + 1;
  }
  return obj;
}
function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  var value = enc(val);
  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError("argument val is invalid");
  }
  var str = name + "=" + value;
  if (opt.maxAge != null) {
    var maxAge = opt.maxAge - 0;
    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    var expires = opt.expires;
    if (!isDate(expires) || isNaN(expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low":
        str += "; Priority=Low";
        break;
      case "medium":
        str += "; Priority=Medium";
        break;
      case "high":
        str += "; Priority=High";
        break;
      default:
        throw new TypeError("option priority is invalid");
    }
  }
  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return str;
}
function decode(str) {
  return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
}
function encode(val) {
  return encodeURIComponent(val);
}
function isDate(val) {
  return __toString.call(val) === "[object Date]" || val instanceof Date;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch (e2) {
    return str;
  }
}

var setCookie = { exports: {} };
var defaultParseOptions = {
  decodeValues: true,
  map: false,
  silent: false
};
function isNonEmptyString(str) {
  return typeof str === "string" && !!str.trim();
}
function parseString(setCookieValue, options) {
  var parts = setCookieValue.split(";").filter(isNonEmptyString);
  var nameValue = parts.shift().split("=");
  var name = nameValue.shift();
  var value = nameValue.join("=");
  options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
  try {
    value = options.decodeValues ? decodeURIComponent(value) : value;
  } catch (e2) {
    console.error("set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.", e2);
  }
  var cookie = {
    name,
    value
  };
  parts.forEach(function(part) {
    var sides = part.split("=");
    var key2 = sides.shift().trimLeft().toLowerCase();
    var value2 = sides.join("=");
    if (key2 === "expires") {
      cookie.expires = new Date(value2);
    } else if (key2 === "max-age") {
      cookie.maxAge = parseInt(value2, 10);
    } else if (key2 === "secure") {
      cookie.secure = true;
    } else if (key2 === "httponly") {
      cookie.httpOnly = true;
    } else if (key2 === "samesite") {
      cookie.sameSite = value2;
    } else {
      cookie[key2] = value2;
    }
  });
  return cookie;
}
function parse(input, options) {
  options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
  if (!input) {
    if (!options.map) {
      return [];
    } else {
      return {};
    }
  }
  if (input.headers && input.headers["set-cookie"]) {
    input = input.headers["set-cookie"];
  } else if (input.headers) {
    var sch = input.headers[Object.keys(input.headers).find(function(key2) {
      return key2.toLowerCase() === "set-cookie";
    })];
    if (!sch && input.headers.cookie && !options.silent) {
      console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning.");
    }
    input = sch;
  }
  if (!Array.isArray(input)) {
    input = [input];
  }
  options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
  if (!options.map) {
    return input.filter(isNonEmptyString).map(function(str) {
      return parseString(str, options);
    });
  } else {
    var cookies = {};
    return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
      var cookie = parseString(str, options);
      cookies2[cookie.name] = cookie;
      return cookies2;
    }, cookies);
  }
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString;
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  var cookiesStrings = [];
  var pos = 0;
  var start;
  var ch;
  var lastComma;
  var nextStart;
  var cookiesSeparatorFound;
  function skipWhitespace() {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  }
  function notSpecialChar() {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  }
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.substring(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
    }
  }
  return cookiesStrings;
}

setCookie.exports = parse;
setCookie.exports.parse = parse;
var parseString_1 = setCookie.exports.parseString = parseString;
var splitCookiesString_1 = setCookie.exports.splitCookiesString = splitCookiesString;

function normalize(loaded) {
  if (loaded.fallthrough) {
    throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
  }
  if ("maxage" in loaded) {
    throw new Error("maxage should be replaced with cache: { maxage }");
  }
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return { status: status || 500, error: new Error() };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn("\"error\" returned from load() without a valid status code \u2014 defaulting to 500");
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      throw new Error("\"redirect\" property returned from load() must be accompanied by a 3xx status code");
    }
    if (typeof loaded.redirect !== "string") {
      throw new Error("\"redirect\" property returned from load() must be a string");
    }
  }
  if (loaded.dependencies) {
    if (!Array.isArray(loaded.dependencies) || loaded.dependencies.some((dep) => typeof dep !== "string")) {
      throw new Error("\"dependencies\" property returned from load() must be of type string[]");
    }
  }
  if (loaded.context) {
    throw new Error("You are returning \"context\" from a load function. \"context\" was renamed to \"stuff\", please adjust your code accordingly.");
  }
  return loaded;
}
function domain_matches(hostname, constraint) {
  if (!constraint)
    return true;
  const normalized = constraint[0] === "." ? constraint.slice(1) : constraint;
  if (hostname === normalized)
    return true;
  return hostname.endsWith("." + normalized);
}
function path_matches(path, constraint) {
  if (!constraint)
    return true;
  const normalized = constraint.endsWith("/") ? constraint.slice(0, -1) : constraint;
  if (path === normalized)
    return true;
  return path.startsWith(normalized + "/");
}
async function load_node({
  event,
  options,
  state,
  route,
  node,
  $session,
  stuff,
  is_error,
  is_leaf,
  status,
                           error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  const cookies = parse_1(event.request.headers.get("cookie") || "");
  const new_cookies = [];
  let loaded;
  const should_prerender = node.module.prerender ?? options.prerender.default;
  const shadow = is_leaf ? await load_shadow_data(route, event, options, should_prerender) : {};
  if (shadow.cookies) {
    shadow.cookies.forEach((header) => {
      new_cookies.push(parseString_1(header));
    });
  }
  if (shadow.error) {
    loaded = {
      status: shadow.status,
      error: shadow.error
    };
  } else if (shadow.redirect) {
    loaded = {
      status: shadow.status,
      redirect: shadow.redirect
    };
  } else if (module2.load) {
    const load_input = {
      url: state.prerendering ? new PrerenderingURL(event.url) : new LoadURL(event.url),
      params: event.params,
      props: shadow.body || {},
      routeId: event.routeId,
      get session() {
        if (node.module.prerender ?? options.prerender.default) {
          throw Error("Attempted to access session from a prerendered page. Session would never be populated.");
        }
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let requested;
        if (typeof resource === "string") {
          requested = resource;
        } else {
          requested = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        opts.headers = new Headers(opts.headers);
        for (const [key2, value] of event.request.headers) {
          if (key2 !== "authorization" && key2 !== "cookie" && key2 !== "host" && key2 !== "if-none-match" && !opts.headers.has(key2)) {
            opts.headers.set(key2, value);
          }
        }
        const resolved = resolve(event.url.pathname, requested.split("?")[0]);
        let response;
        let dependency;
        const prefix = options.paths.assets || options.paths.base;
        const filename = decodeURIComponent(resolved.startsWith(prefix) ? resolved.slice(prefix.length) : resolved).slice(1);
        const filename_html = `${filename}/index.html`;
        const is_asset = options.manifest.assets.has(filename);
        const is_asset_html = options.manifest.assets.has(filename_html);
        if (is_asset || is_asset_html) {
          const file = is_asset ? filename : filename_html;
          if (options.read) {
            const type = is_asset ? options.manifest.mimeTypes[filename.slice(filename.lastIndexOf("."))] : "text/html";
            response = new Response(options.read(file), {
              headers: type ? { "content-type": type } : {}
            });
          } else {
            response = await fetch(`${event.url.origin}/${file}`, opts);
          }
        } else if (is_root_relative(resolved)) {
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            const authorization = event.request.headers.get("authorization");
            const combined_cookies = { ...cookies };
            for (const cookie2 of new_cookies) {
              if (!domain_matches(event.url.hostname, cookie2.domain))
                continue;
              if (!path_matches(resolved, cookie2.path))
                continue;
              combined_cookies[cookie2.name] = cookie2.value;
            }
            const cookie = Object.entries(combined_cookies).map(([name, value]) => `${name}=${value}`).join("; ");
            if (cookie) {
              opts.headers.set("cookie", cookie);
            }
            if (authorization && !opts.headers.has("authorization")) {
              opts.headers.set("authorization", authorization);
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          response = await respond(new Request(new URL(requested, event.url).href, { ...opts }), options, {
            ...state,
            initiator: route
          });
          if (state.prerendering) {
            dependency = { response, body: null };
            state.prerendering.dependencies.set(resolved, dependency);
          }
        } else {
          if (resolved.startsWith("//")) {
            requested = event.url.protocol + requested;
          }
          if (`.${new URL(requested).hostname}`.endsWith(`.${event.url.hostname}`) && opts.credentials !== "omit") {
            uses_credentials = true;
            const cookie = event.request.headers.get("cookie");
            if (cookie)
              opts.headers.set("cookie", cookie);
          }
          const external_request = new Request(requested, opts);
          response = await options.hooks.externalFetch.call(null, external_request);
        }
        const set_cookie = response.headers.get("set-cookie");
        if (set_cookie) {
          new_cookies.push(...splitCookiesString_1(set_cookie).map((str) => parseString_1(str)));
        }
        const proxy = new Proxy(response, {
          get(response2, key2, _receiver) {
            async function text() {
              const body = await response2.text();
              const headers = {};
              for (const [key3, value] of response2.headers) {
                if (key3 !== "set-cookie" && key3 !== "etag") {
                  headers[key3] = value;
                }
              }
              if (!opts.body || typeof opts.body === "string") {
                const status_number = Number(response2.status);
                if (isNaN(status_number)) {
                  throw new Error(`response.status is not a number. value: "${response2.status}" type: ${typeof response2.status}`);
                }
                fetched.push({
                  url: requested,
                  body: opts.body,
                  response: {
                    status: status_number,
                    statusText: response2.statusText,
                    headers,
                    body
                  }
                });
              }
              if (dependency) {
                dependency.body = body;
              }
              return body;
            }

            if (key2 === "arrayBuffer") {
              return async () => {
                const buffer = await response2.arrayBuffer();
                if (dependency) {
                  dependency.body = new Uint8Array(buffer);
                }
                return buffer;
              };
            }
            if (key2 === "text") {
              return text;
            }
            if (key2 === "json") {
              return async () => {
                return JSON.parse(await text());
              };
            }
            return Reflect.get(response2, key2, response2);
          }
        });
        return proxy;
      },
      stuff: { ...stuff },
      status: is_error ? status ?? null : null,
      error: is_error ? error2 ?? null : null
    };
    if (options.dev) {
      Object.defineProperty(load_input, "page", {
        get: () => {
          throw new Error("`page` in `load` functions has been replaced by `url` and `params`");
        }
      });
    }
    loaded = await module2.load.call(null, load_input);
    if (!loaded) {
      throw new Error(`load function must return a value${options.dev ? ` (${node.entry})` : ""}`);
    }
  } else if (shadow.body) {
    loaded = {
      props: shadow.body
    };
  } else {
    loaded = {};
  }
  if (shadow.body && state.prerendering) {
    const pathname = `${event.url.pathname.replace(/\/$/, "")}/__data.json`;
    const dependency = {
      response: new Response(void 0),
      body: JSON.stringify(shadow.body)
    };
    state.prerendering.dependencies.set(pathname, dependency);
  }
  return {
    node,
    props: shadow.body,
    loaded: normalize(loaded),
    stuff: loaded.stuff || stuff,
    fetched,
    set_cookie_headers: new_cookies.map((new_cookie) => {
      const { name, value, ...options2 } = new_cookie;
      return serialize_1(name, value, options2);
    }),
    uses_credentials
  };
}
async function load_shadow_data(route, event, options, prerender) {
  if (!route.shadow)
    return {};
  try {
    const mod = await route.shadow();
    if (prerender && (mod.post || mod.put || mod.del || mod.patch)) {
      throw new Error("Cannot prerender pages that have endpoints with mutative methods");
    }
    const method = normalize_request_method(event);
    const is_get = method === "head" || method === "get";
    const handler = method === "head" ? mod.head || mod.get : mod[method];
    if (!handler && !is_get) {
      return {
        status: 405,
        error: new Error(`${method} method not allowed`)
      };
    }
    const data = {
      status: 200,
      cookies: [],
      body: {}
    };
    if (!is_get) {
      const result = await handler(event);
      if (result.fallthrough) {
        throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
      }
      const { status, headers, body } = validate_shadow_output(result);
      data.status = status;
      add_cookies(data.cookies, headers);
      if (status >= 300 && status < 400) {
        data.redirect = headers instanceof Headers ? headers.get("location") : headers.location;
        return data;
      }
      data.body = body;
    }
    const get = method === "head" && mod.head || mod.get;
    if (get) {
      const result = await get(event);
      if (result.fallthrough) {
        throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
      }
      const { status, headers, body } = validate_shadow_output(result);
      add_cookies(data.cookies, headers);
      data.status = status;
      if (status >= 400) {
        data.error = new Error("Failed to load data");
        return data;
      }
      if (status >= 300) {
        data.redirect = headers instanceof Headers ? headers.get("location") : headers.location;
        return data;
      }
      data.body = { ...body, ...data.body };
    }
    return data;
  } catch (e2) {
    const error2 = coalesce_to_error(e2);
    options.handle_error(error2, event);
    return {
      status: 500,
      error: error2
    };
  }
}
function add_cookies(target, headers) {
  const cookies = headers["set-cookie"];
  if (cookies) {
    if (Array.isArray(cookies)) {
      target.push(...cookies);
    } else {
      target.push(cookies);
    }
  }
}
function validate_shadow_output(result) {
  const { status = 200, body = {} } = result;
  let headers = result.headers || {};
  if (headers instanceof Headers) {
    if (headers.has("set-cookie")) {
      throw new Error("Endpoint request handler cannot use Headers interface with Set-Cookie headers");
    }
  } else {
    headers = lowercase_keys(headers);
  }
  if (!is_pojo(body)) {
    throw new Error("Body returned from endpoint request handler must be a plain object");
  }
  return { status, headers, body };
}
async function respond_with_error({
  event,
  options,
  state,
  $session,
  status,
  error: error2,
                                    resolve_opts
}) {
  try {
    const branch = [];
    let stuff = {};
    if (resolve_opts.ssr) {
      const default_layout = await options.manifest._.nodes[0]();
      const default_error = await options.manifest._.nodes[1]();
      const layout_loaded = await load_node({
        event,
        options,
        state,
        route: null,
        node: default_layout,
        $session,
        stuff: {},
        is_error: false,
        is_leaf: false
      });
      const error_loaded = await load_node({
        event,
        options,
        state,
        route: null,
        node: default_error,
        $session,
        stuff: layout_loaded ? layout_loaded.stuff : {},
        is_error: true,
        is_leaf: false,
        status,
        error: error2
      });
      branch.push(layout_loaded, error_loaded);
      stuff = error_loaded.stuff;
    }
    return await render_response({
      options,
      state,
      $session,
      page_config: {
        hydrate: options.hydrate,
        router: options.router
      },
      stuff,
      status,
      error: error2,
      branch,
      event,
      resolve_opts
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options.handle_error(error3, event);
    return new Response(error3.stack, {
      status: 500
    });
  }
}
async function respond$1(opts) {
  const { event, options, state, $session, route, resolve_opts } = opts;
  let nodes;
  if (!resolve_opts.ssr) {
    return await render_response({
      ...opts,
      branch: [],
      page_config: {
        hydrate: true,
        router: true
      },
      status: 200,
      error: null,
      event,
      stuff: {}
    });
  }
  try {
    nodes = await Promise.all(route.a.map((n) => n == void 0 ? n : options.manifest._.nodes[n]()));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options.handle_error(error3, event);
    return await respond_with_error({
      event,
      options,
      state,
      $session,
      status: 500,
      error: error3,
      resolve_opts
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options);
  if (state.prerendering) {
    const should_prerender = leaf.prerender ?? options.prerender.default;
    if (!should_prerender) {
      return new Response(void 0, {
        status: 204
      });
    }
  }
  let branch = [];
  let status = 200;
  let error2 = null;
  let set_cookie_headers = [];
  let stuff = {};
  ssr: {
    for (let i2 = 0; i2 < nodes.length; i2 += 1) {
      const node = nodes[i2];
      let loaded;
      if (node) {
        try {
          loaded = await load_node({
            ...opts,
            node,
            stuff,
            is_error: false,
            is_leaf: i2 === nodes.length - 1
          });
          set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
          if (loaded.loaded.redirect) {
            return with_cookies(new Response(void 0, {
              status: loaded.loaded.status,
              headers: {
                location: loaded.loaded.redirect
              }
            }), set_cookie_headers);
          }
          if (loaded.loaded.error) {
            ({ status, error: error2 } = loaded.loaded);
          }
        } catch (err) {
          const e2 = coalesce_to_error(err);
          options.handle_error(e2, event);
          status = 500;
          error2 = e2;
        }
        if (loaded && !error2) {
          branch.push(loaded);
        }
        if (error2) {
          while (i2--) {
            if (route.b[i2]) {
              const index7 = route.b[i2];
              const error_node = await options.manifest._.nodes[index7]();
              let node_loaded;
              let j = i2;
              while (!(node_loaded = branch[j])) {
                j -= 1;
              }
              try {
                const error_loaded = await load_node({
                  ...opts,
                  node: error_node,
                  stuff: node_loaded.stuff,
                  is_error: true,
                  is_leaf: false,
                  status,
                  error: error2
                });
                if (error_loaded.loaded.error) {
                  continue;
                }
                page_config = get_page_config(error_node.module, options);
                branch = branch.slice(0, j + 1).concat(error_loaded);
                stuff = { ...node_loaded.stuff, ...error_loaded.stuff };
                break ssr;
              } catch (err) {
                const e2 = coalesce_to_error(err);
                options.handle_error(e2, event);
                continue;
              }
            }
          }
          return with_cookies(await respond_with_error({
            event,
            options,
            state,
            $session,
            status,
            error: error2,
            resolve_opts
          }), set_cookie_headers);
        }
      }
      if (loaded && loaded.loaded.stuff) {
        stuff = {
          ...stuff,
          ...loaded.loaded.stuff
        };
      }
    }
  }
  try {
    return with_cookies(await render_response({
      ...opts,
      stuff,
      event,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    }), set_cookie_headers);
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options.handle_error(error3, event);
    return with_cookies(await respond_with_error({
      ...opts,
      status: 500,
      error: error3
    }), set_cookie_headers);
  }
}
function get_page_config(leaf, options) {
  if ("ssr" in leaf) {
    throw new Error("`export const ssr` has been removed \u2014 use the handle hook instead: https://kit.svelte.dev/docs/hooks#handle");
  }
  return {
    router: "router" in leaf ? !!leaf.router : options.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options.hydrate
  };
}
function with_cookies(response, set_cookie_headers) {
  if (set_cookie_headers.length) {
    set_cookie_headers.forEach((value) => {
      response.headers.append("set-cookie", value);
    });
  }
  return response;
}
async function render_page(event, route, options, state, resolve_opts) {
  if (state.initiator === route) {
    return new Response(`Not found: ${event.url.pathname}`, {
      status: 404
    });
  }
  if (route.shadow) {
    const type = negotiate(event.request.headers.get("accept") || "text/html", [
      "text/html",
      "application/json"
    ]);
    if (type === "application/json") {
      return render_endpoint(event, await route.shadow());
    }
  }
  const $session = await options.hooks.getSession(event);
  return respond$1({
    event,
    options,
    state,
    $session,
    resolve_opts,
    route
  });
}
function negotiate(accept, types2) {
  const parts = accept.split(",").map((str, i2) => {
    const match = /([^/]+)\/([^;]+)(?:;q=([0-9.]+))?/.exec(str);
    if (match) {
      const [, type, subtype, q = "1"] = match;
      return { type, subtype, q: +q, i: i2 };
    }
    throw new Error(`Invalid Accept header: ${accept}`);
  }).sort((a, b) => {
    if (a.q !== b.q) {
      return b.q - a.q;
    }
    if (a.subtype === "*" !== (b.subtype === "*")) {
      return a.subtype === "*" ? 1 : -1;
    }
    if (a.type === "*" !== (b.type === "*")) {
      return a.type === "*" ? 1 : -1;
    }
    return a.i - b.i;
  });
  let accepted;
  let min_priority = Infinity;
  for (const mimetype of types2) {
    const [type, subtype] = mimetype.split("/");
    const priority = parts.findIndex((part) => (part.type === type || part.type === "*") && (part.subtype === subtype || part.subtype === "*"));
    if (priority !== -1 && priority < min_priority) {
      accepted = mimetype;
      min_priority = priority;
    }
  }
  return accepted;
}
function exec(match, names, types2, matchers) {
  const params = {};
  for (let i2 = 0; i2 < names.length; i2 += 1) {
    const name = names[i2];
    const type = types2[i2];
    const value = match[i2 + 1] || "";
    if (type) {
      const matcher = matchers[type];
      if (!matcher)
        throw new Error(`Missing "${type}" param matcher`);
      if (!matcher(value))
        return;
    }
    params[name] = value;
  }
  return params;
}

var DATA_SUFFIX = "/__data.json";
var default_transform = ({ html }) => html;

async function respond(request, options, state) {
  var _a, _b, _c, _d;
  let url = new URL(request.url);
  const { parameter, allowed } = options.method_override;
  const method_override = (_a = url.searchParams.get(parameter)) == null ? void 0 : _a.toUpperCase();
  if (method_override) {
    if (request.method === "POST") {
      if (allowed.includes(method_override)) {
        request = new Proxy(request, {
          get: (target, property, _receiver) => {
            if (property === "method")
              return method_override;
            return Reflect.get(target, property, target);
          }
        });
      } else {
        const verb = allowed.length === 0 ? "enabled" : "allowed";
        const body = `${parameter}=${method_override} is not ${verb}. See https://kit.svelte.dev/docs/configuration#methodoverride`;
        return new Response(body, {
          status: 400
        });
      }
    } else {
      throw new Error(`${parameter}=${method_override} is only allowed with POST requests`);
    }
  }
  let decoded = decodeURI(url.pathname);
  let route = null;
  let params = {};
  if (options.paths.base && !((_b = state.prerendering) == null ? void 0 : _b.fallback)) {
    if (!decoded.startsWith(options.paths.base)) {
      return new Response(void 0, { status: 404 });
    }
    decoded = decoded.slice(options.paths.base.length) || "/";
  }
  const is_data_request = decoded.endsWith(DATA_SUFFIX);
  if (is_data_request) {
    const data_suffix_length = DATA_SUFFIX.length - (options.trailing_slash === "always" ? 1 : 0);
    decoded = decoded.slice(0, -data_suffix_length) || "/";
    url = new URL(url.origin + url.pathname.slice(0, -data_suffix_length) + url.search);
  }
  if (!((_c = state.prerendering) == null ? void 0 : _c.fallback)) {
    const matchers = await options.manifest._.matchers();
    for (const candidate of options.manifest._.routes) {
      const match = candidate.pattern.exec(decoded);
      if (!match)
        continue;
      const matched = exec(match, candidate.names, candidate.types, matchers);
      if (matched) {
        route = candidate;
        params = decode_params(matched);
        break;
      }
    }
  }
  if (route) {
    if (route.type === "page") {
      const normalized = normalize_path(url.pathname, options.trailing_slash);
      if (normalized !== url.pathname && !((_d = state.prerendering) == null ? void 0 : _d.fallback)) {
        return new Response(void 0, {
          status: 301,
          headers: {
            "x-sveltekit-normalize": "1",
            location: (normalized.startsWith("//") ? url.origin + normalized : normalized) + (url.search === "?" ? "" : url.search)
          }
        });
      }
    } else if (is_data_request) {
      return new Response(void 0, {
        status: 404
      });
    }
  }
  const event = {
    get clientAddress() {
      if (!state.getClientAddress) {
        throw new Error(`${"svelte-adapter-firebase"} does not specify getClientAddress. Please raise an issue`);
      }
      Object.defineProperty(event, "clientAddress", {
        value: state.getClientAddress()
      });
      return event.clientAddress;
    },
    locals: {},
    params,
    platform: state.platform,
    request,
    routeId: route && route.id,
    url
  };
  const removed = (property, replacement, suffix = "") => ({
    get: () => {
      throw new Error(`event.${property} has been replaced by event.${replacement}` + suffix);
    }
  });
  const details = ". See https://github.com/sveltejs/kit/pull/3384 for details";
  const body_getter = {
    get: () => {
      throw new Error("To access the request body use the text/json/arrayBuffer/formData methods, e.g. `body = await request.json()`" + details);
    }
  };
  Object.defineProperties(event, {
    method: removed("method", "request.method", details),
    headers: removed("headers", "request.headers", details),
    origin: removed("origin", "url.origin"),
    path: removed("path", "url.pathname"),
    query: removed("query", "url.searchParams"),
    body: body_getter,
    rawBody: body_getter
  });
  let resolve_opts = {
    ssr: true,
    transformPage: default_transform
  };
  try {
    const response = await options.hooks.handle({
      event,
      resolve: async (event2, opts) => {
        var _a2;
        if (opts) {
          resolve_opts = {
            ssr: opts.ssr !== false,
            transformPage: opts.transformPage || default_transform
          };
        }
        if ((_a2 = state.prerendering) == null ? void 0 : _a2.fallback) {
          return await render_response({
            event: event2,
            options,
            state,
            $session: await options.hooks.getSession(event2),
            page_config: { router: true, hydrate: true },
            stuff: {},
            status: 200,
            error: null,
            branch: [],
            resolve_opts: {
              ...resolve_opts,
              ssr: false
            }
          });
        }
        if (route) {
          let response2;
          if (is_data_request && route.type === "page" && route.shadow) {
            response2 = await render_endpoint(event2, await route.shadow());
            if (request.headers.has("x-sveltekit-load")) {
              if (response2.status >= 300 && response2.status < 400) {
                const location = response2.headers.get("location");
                if (location) {
                  const headers = new Headers(response2.headers);
                  headers.set("x-sveltekit-location", location);
                  response2 = new Response(void 0, {
                    status: 204,
                    headers
                  });
                }
              }
            }
          } else {
            response2 = route.type === "endpoint" ? await render_endpoint(event2, await route.load()) : await render_page(event2, route, options, state, resolve_opts);
          }
          if (response2) {
            if (response2.status === 200 && response2.headers.has("etag")) {
              let if_none_match_value = request.headers.get("if-none-match");
              if (if_none_match_value == null ? void 0 : if_none_match_value.startsWith("W/\"")) {
                if_none_match_value = if_none_match_value.substring(2);
              }
              const etag = response2.headers.get("etag");
              if (if_none_match_value === etag) {
                const headers = new Headers({ etag });
                for (const key2 of [
                  "cache-control",
                  "content-location",
                  "date",
                  "expires",
                  "vary"
                ]) {
                  const value = response2.headers.get(key2);
                  if (value)
                    headers.set(key2, value);
                }
                return new Response(void 0, {
                  status: 304,
                  headers
                });
              }
            }
            return response2;
          }
        }
        if (!state.initiator) {
          const $session = await options.hooks.getSession(event2);
          return await respond_with_error({
            event: event2,
            options,
            state,
            $session,
            status: 404,
            error: new Error(`Not found: ${event2.url.pathname}`),
            resolve_opts
          });
        }
        if (state.prerendering) {
          return new Response("not found", { status: 404 });
        }
        return await fetch(request);
      },
      get request() {
        throw new Error("request in handle has been replaced with event" + details);
      }
    });
    if (response && !(response instanceof Response)) {
      throw new Error("handle must return a Response object" + details);
    }
    return response;
  } catch (e2) {
    const error2 = coalesce_to_error(e2);
    options.handle_error(error2, event);
    try {
      const $session = await options.hooks.getSession(event);
      return await respond_with_error({
        event,
        options,
        state,
        $session,
        status: 500,
        error: error2,
        resolve_opts
      });
    } catch (e22) {
      const error3 = coalesce_to_error(e22);
      return new Response(options.dev ? error3.stack : error3.message, {
        status: 500
      });
    }
  }
}

var base = "";
var assets = "";

function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}

var template = ({
                  head,
                  body,
                  assets: assets2,
                  nonce
                }) => "<html>\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width\">\n\n  <title>PeaceBox : Tools for your Mind</title>\n\n  " + head + `

  <script src="https://kit.fontawesome.com/af75aac62e.js" crossorigin="anonymous"><\/script>
</head>
<body onload="document.querySelector('#copyright').innerText = new Date().getFullYear()">
<!-- SVG Background -->
` + body + "\n</body>\n</html>\n\n";
var read = null;
set_paths({ "base": "", "assets": "" });
var Server = class {
  constructor(manifest2) {
    this.options = {
      csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
      dev: false,
      floc: false,
      get_stack: (error2) => String(error2),
      handle_error: (error2, event) => {
        this.options.hooks.handleError({
          error: error2,
          event,
          get request() {
            throw new Error("request in handleError has been replaced with event. See https://github.com/sveltejs/kit/pull/3384 for details");
          }
        });
        error2.stack = this.options.get_stack(error2);
      },
      hooks: null,
      hydrate: true,
      manifest: manifest2,
      method_override: { "parameter": "_method", "allowed": [] },
      paths: { base, assets },
      prefix: assets + "/_app/immutable/",
      prerender: {
        default: false,
        enabled: true
      },
      read,
      root: Root,
      service_worker: null,
      router: true,
      template,
      template_contains_nonce: false,
      trailing_slash: "never"
    };
  }
  async respond(request, options = {}) {
    if (!(request instanceof Request)) {
      throw new Error("The first argument to server.respond must be a Request object. See https://github.com/sveltejs/kit/pull/3384 for details");
    }
    if (!this.options.hooks) {
      const module2 = await Promise.resolve().then(() => (init_hooks_1c45ba0b(), hooks_1c45ba0b_exports));
      this.options.hooks = {
        getSession: module2.getSession || (() => ({})),
        handle: module2.handle || (({ event, resolve: resolve2 }) => resolve2(event)),
        handleError: module2.handleError || (({ error: error2 }) => console.error(error2.stack)),
        externalFetch: module2.externalFetch || fetch
      };
    }
    return respond(request, this.options, options);
  }
};

// .svelte-kit/output/server/manifest.js
init_shims();
var manifest = {
  appDir: "_app",
  assets: /* @__PURE__ */ new Set(["favicon.png"]),
  mimeTypes: { ".png": "image/png" },
  _: {
    entry: {
      "file": "start-cbc4a3e3.js",
      "js": ["start-cbc4a3e3.js", "chunks/index-ceb1e3f7.js", "chunks/index-01a167d0.js", "chunks/preload-helper-60cab3ee.js"],
      "css": []
    },
    nodes: [
      () => Promise.resolve().then(() => (init__(), __exports)),
      () => Promise.resolve().then(() => (init__2(), __exports2)),
      () => Promise.resolve().then(() => (init__3(), __exports3)),
      () => Promise.resolve().then(() => (init__4(), __exports4)),
      () => Promise.resolve().then(() => (init__5(), __exports5)),
      () => Promise.resolve().then(() => (init__6(), __exports6))
    ],
    routes: [
      {
        type: "page",
        id: "",
        pattern: /^\/$/,
        names: [],
        types: [],
        path: "/",
        shadow: null,
        a: [0, 2],
        b: [1]
      },
      {
        type: "page",
        id: "license",
        pattern: /^\/license\/?$/,
        names: [],
        types: [],
        path: "/license",
        shadow: null,
        a: [0, 3],
        b: [1]
      },
      {
        type: "page",
        id: "privacy",
        pattern: /^\/privacy\/?$/,
        names: [],
        types: [],
        path: "/privacy",
        shadow: null,
        a: [0, 4],
        b: [1]
      },
      {
        type: "page",
        id: "terms",
        pattern: /^\/terms\/?$/,
        names: [],
        types: [],
        path: "/terms",
        shadow: null,
        a: [0, 5],
        b: [1]
      }
    ],
    matchers: async () => {
      return {};
    }
  }
};

// .svelte-kit/.svelte-kit/firebase-to-svelte-kit.js
init_shims();
function toSvelteKitRequest(request) {
  const host = `${request.headers["x-forwarded-proto"]}://${request.headers.host}`;
  const { href, pathname, searchParams: searchParameters } = new URL(request.url || "", host);
  return new Request(href, {
    method: request.method,
    headers: toSvelteKitHeaders(request.headers),
    body: request.rawBody ? request.rawBody : null,
    host,
    path: pathname,
    query: searchParameters
  });
}
function toSvelteKitHeaders(headers) {
  const finalHeaders = {};
  for (const [key2, value] of Object.entries(headers)) {
    finalHeaders[key2] = Array.isArray(value) ? value.join(",") : value;
  }
  return finalHeaders;
}

// .svelte-kit/.svelte-kit/entry.js
var server = new Server(manifest);
async function svelteKit(request, response) {
  const rendered = await server.respond(toSvelteKitRequest(request));
  const body = await rendered.text();
  return rendered ? response.writeHead(rendered.status, rendered.headers).end(body) : response.writeHead(404, "Not Found").end();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
