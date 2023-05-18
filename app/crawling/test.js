const testString = "a/c/d,asd, ver/sa/a!";

const expandString = (str) =>
    str
        .split(",")
        .flatMap((segment) =>
            segment
                .split("/")
                .map((subSegment, i, arr) => (i === 0 ? subSegment.trim() : arr[0].trim() + subSegment.trim()))
        );

expandString(testString).forEach((x) => console.log(x));
