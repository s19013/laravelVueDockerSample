<?php
namespace App\Http\Repository;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Collection;
use App\Models\Task;


class TaskRepository{

    function store(Array $attributes) :object{
        return Task::create($attributes);
    }

    function update(Int $id,Array $attributes)  {
        Task::where('id','=',$id)
        ->update($attributes);
    }

    // タスク完了(論理削除)
    function done(Int $id)  {
        Task::find($id)->delete();
    }

    // 物理削除
    function destroy(Int $id)  {
        Task::find($id)->forceDelete();
    }

    function incompleteTask() : Collection {
        return Task::where('deleted_at', null)->get();
    }

    function searchIncompleteTask(Array $attributes) : Collection {
         // 検索につかうようにエスケープしたり､空白区切りで配列化
         $wordListToSearch = $this->preparationToAndSearch($attributes['keyword']);

         $query = Task::where('deleted_at', null);

        //  キーワードたちでlike検索
         foreach($wordListToSearch as $word){$query->where('task_name','like',"%$word%");}

         return $query->get();
    }

     /**sqlでlike検索する前にするエスケープ処理 */
     public function sqlEscape($arg)
     {
         // %をエスケープ
         $escaped = preg_replace(
         '/%/',
         '\%',
         $arg);

         // _をエスケープ
         $escaped = preg_replace(
         '/_/',
         '\_',
         $escaped);

         return $escaped;
     }

     /**and検索できるように空白で区切って､配列にする */
     public function separatedByWhiteSpace($arg){
         // 全角スペースを半角に変換
         $spaceConversion = mb_convert_kana($arg, 's');

         // 単語を半角スペースで区切り、配列にする
         return preg_split('/[\s,]+/', $spaceConversion, -1, PREG_SPLIT_NO_EMPTY);
     }

     /** エスケープして､空白区切りの配列を返す */
     public function preparationToAndSearch($arg)
     {
         return $this->separatedByWhiteSpace($this->sqlEscape($arg));
     }
}
