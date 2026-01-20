"use client";

import { cn } from "@/core/utils";
import { motion } from "motion/react";

export function R({
  classNames,
  className,
  ...props
}: React.SVGAttributes<SVGSVGElement> & {
  classNames?: { upper?: string; lower?: string };
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={641.42145}
      height={500}
      viewBox="0 0 641.42145 500"
      xmlSpace="preserve"
      className={cn("size-24", className)}
      {...props}
    >
      <g transform="matrix(1.9909945,0,0,1.9909945,-1292.4585,-1295.8)">
        <motion.path
          d="m 649.15224,650.83053 29.98425,29.98425 a 69.115003,69.115003 22.5 0 0 48.87169,20.24332 l 112.50448,0 a 9.5427899,9.5427899 45 0 1 9.54279,9.54279 v 21.59684 a 19.085582,19.085582 135 0 1 -19.08558,19.08558 l -81.36485,0 141.13503,141.13503 a 32.581754,32.581754 22.5 0 0 23.03877,9.54297 h 57.53475 l -96.49989,-96.49989 a 2.3155465,2.3155465 112.5 0 1 1.63733,-3.95289 26.339835,26.339835 129.77562 0 0 23.83201,-28.62882 l 0,-74.33433 a 47.714848,47.714848 45 0 0 -47.71485,-47.71485 z"
          className={cn(
            "fill-transparent stroke-current stroke-6",
            classNames?.upper,
          )}
          initial={{ pathLength: 0, fillOpacity: 0 }}
          animate={{ pathLength: 1, fillOpacity: [0, 1] }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.path
          d="m 699.37981,772.08865 0,61.04471 a 24.107944,24.107944 67.5 0 0 7.06105,17.04689 l 45.75392,45.75392 a 20.57795,20.57795 22.5 0 0 14.55081,6.02714 h 62.50688 C 785.96159,858.67042 742.6707,815.37954 699.37981,772.08865 Z"
          className={cn(
            "stroke-rvns fill-transparent stroke-6",
            classNames?.lower,
          )}
          initial={{ pathLength: 0, fillOpacity: 0 }}
          animate={{ pathLength: 1, fillOpacity: [0, 1] }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </g>
    </svg>
  );
}
