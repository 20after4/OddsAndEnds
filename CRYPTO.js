/*
 * Convenience wrapper for nsICryptoHash,
 * based on examples from the documentation which can be found at MDC: 
 * http://developer.mozilla.org/en/docs/nsICryptoHash
 *
 * Code samples from MDC are licensed under the MIT License, I decided
 * to stick with the same licensing for this module. The entire contents of
 * of this module are licensed under the standard MIT License as follows:
 *
 * The MIT License
 *
 * Copyright (c) 2008 Mukunda Modell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */


EXPORTED_SYMBOLS = ["CRYPTO"];

var Cu = Components.utils;
var Ci = Components.interfaces;
var Cc = Components.classes;

// return the two-digit hexadecimal code for a byte
function toHexString(charCode)
{
  return ("0" + charCode.toString(16)).slice(-2);
}

var CRYPTO = {

  //make a sha-256 hash from a string
	str2UTF8Bytes:function(str) {
		
		var converter =
		  Cc["@mozilla.org/intl/scriptableunicodeconverter"].
		    createInstance(Ci.nsIScriptableUnicodeConverter);
		
		// we use UTF-8 here, you can choose other encodings.
		converter.charset = "UTF-8";
		// result is an out parameter,
		// result.value will contain the array length
		var result = {};
		// data is an array of bytes
		var data = converter.convertToByteArray(str, result);
		return data;
	},
	bytes2SHA:function(bytes,moreBytes,evenMoreBytes) {
		var ch = Cc["@mozilla.org/security/hash;1"]
		                   .createInstance(Ci.nsICryptoHash);
		ch.init(ch.SHA256);

		ch.update(bytes, bytes.length);

		if (moreBytes)
			ch.update(moreBytes, moreBytes.length);
		if (evenMoreBytes)
			ch.update(evenMoreBytes, evenMoreBytes.length);

		var hash = ch.finish(false);
		return hash;
	},
	bytes2SHABytes:function(bytes,moreBytes,evenMoreBytes) {
		return this.toByteArray(this.bytes2SHA(bytes,moreBytes,evenMoreBytes));
	},
	toHexString:function(hash) {
		// convert the binary hash data to a hex string.
		return [toHexString(hash.charCodeAt(i)) for (i in hash)].join("");
	},
	toByteArray:function(hash) {
		return [hash.charCodeAt(i) for (i in hash)];
	}
}
