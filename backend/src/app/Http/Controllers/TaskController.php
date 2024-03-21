<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Http\Repository\TaskRepository;
use App\Http\Requests\CreateTaskRequest;

class TaskController extends Controller
{
    public function __construct(){
        $this->taskRepository = new TaskRepository();
    }

    function index(Request $request ) {
        $tasks = null;
        $attributes = $request->only(['keyword']);

        // 初期状態､keywordがからの時
        if (empty($attributes) || empty($attributes['keyword'])) {
            $tasks = $this->taskRepository->incompleteTask();
        }
        else {
            $tasks = $this->taskRepository->searchIncompleteTask($attributes);
        }

        return response()->json($tasks);
    }

    function store(CreateTaskRequest $request) {
        $attributes = $request->only(['task_name']);
        try {
            $this->taskRepository->store($attributes);
        } catch (\Throwable $th) {
            // 何かエラー発生したらログを残してエラーがおきたことを伝える
            \Log::error($th);
            return redirect()->json(['message' => 'エラーが発生しました｡時間を置いて再度送信して下さい｡'],500);
        }

        return redirect()->json(['message' => '登録できました。']);

    }

    function update(Request $request) {
        $attributes = $request->only(['task_name']);
        try {
            $this->taskRepository->update($request->id,$attributes);
        } catch (\Throwable $th) {
            // 何かエラー発生したらログを残してエラーがおきたことを伝える
            \Log::error($th);
            return redirect()->json(['message' => 'エラーが発生しました｡時間を置いて再度送信して下さい｡'],500);
        }

        return redirect()->json(['message' => '編集できました。']);
    }

    function done(Request $request) {
        try {
            $this->taskRepository->done($request->id);
        } catch (\Throwable $th) {
            \Log::error($th);
            return redirect()->json(['message' => 'エラーが発生しました｡時間を置いて再度送信して下さい｡'],500);
        }
        return redirect()->json(['message' => '完了しました']);
    }

    function destroy(Request $request) {
        try {
            $this->taskRepository->destroy($request->id);
        } catch (\Throwable $th) {
            \Log::error($th);
            return redirect()->json(['message' => 'エラーが発生しました｡時間を置いて再度送信して下さい｡'],500);
        }
        return redirect()->json(['message' => '削除しました']);

    }
}
